import prisma from '../lib/prisma';

export const criarVenda = async (dados: any) => {
  const { itens, total, pagamento, usuario } = dados;
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error('Itens da venda são obrigatórios');
  }
  if (!pagamento || !pagamento.forma) {
    throw new Error('Forma de pagamento obrigatória');
  }
  const totalStr = Number(total).toFixed(2);
  const valorPagoStr = Number(pagamento.valorPago).toFixed(2);
  if (parseFloat(valorPagoStr) < parseFloat(totalStr)) {
    throw new Error('Valor pago insuficiente');
  }
  const troco = (parseFloat(valorPagoStr) - parseFloat(totalStr)).toFixed(2);
  const venda = await prisma.sale.create({
    data: {
      total: totalStr,
      valorPago: valorPagoStr,
      troco: troco === '0.00' ? null : troco,
      vendedorId: usuario.id,
      metodoPagamento: pagamento.forma,
      saleItems: {
        create: itens.map((item: any) => ({
          nome: item.nome,
          preco: Number(item.preco).toFixed(2),
          quantidade: item.quantidade,
          product: { connect: { id: item.productId } }
        }))
      }
    },
    include: {
      saleItems: true
    }
  });
  return venda;
};

export const listarVendas = async () => {
  return await prisma.sale.findMany({
    include: {
      vendedor: { select: { id: true, nome: true, email: true } },
      saleItems: true
    }
  });
};

export const buscarVendaPorId = async (id: string) => {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      vendedor: { select: { id: true, nome: true, email: true } },
      saleItems: true
    }
  });
};

export const deletarVenda = async (id: string) => {
  return await prisma.sale.delete({ where: { id } });
};

export const listarHistoricoVendas = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [vendas, total] = await Promise.all([
    prisma.sale.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        total: true,
        metodoPagamento: true
      }
    }),
    prisma.sale.count()
  ]);
  return {
    vendas,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const gerarRelatorioVendas = async (inicio: string, fim: string) => {
  // Busca vendas no período
  const vendas = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: new Date(inicio + 'T00:00:00.000Z'),
        lte: new Date(fim + 'T23:59:59.999Z')
      }
    },
    include: { saleItems: { include: { product: true } } } // Corrigido para incluir o produto
  });

  // Agregações
  let totalVendas = 0;
  let totalItensKg = 0;
  let totalItensUn = 0;
  let valorTotal = 0;
  const formasPagamento: Record<string, number> = {};

  for (const venda of vendas) {
    totalVendas++;
    valorTotal += Number(venda.total);
    formasPagamento[venda.metodoPagamento] = (formasPagamento[venda.metodoPagamento] || 0) + Number(venda.total);
    for (const item of venda.saleItems) {
      // Busca o tipo do produto corretamente
      const tipo = (item.product as any)?.tipo || 'unidade';
      if (tipo === 'peso') {
        totalItensKg += Number(item.quantidade);
      } else {
        totalItensUn += Number(item.quantidade);
      }
    }
  }

  return {
    totalVendas,
    totalItensKg,
    totalItensUn,
    valorTotal,
    formasPagamento
  };
}; 