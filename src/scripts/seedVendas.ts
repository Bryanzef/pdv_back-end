import prisma from '../lib/prisma';

function getDateRange(start: Date, end: Date) {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

async function main() {
  // Buscar admin e produtos
  const admin = await prisma.user.findFirst({ where: { perfil: 'admin' } });
  const produtos = await prisma.product.findMany({ take: 5 });
  if (!admin || produtos.length < 2) {
    console.error('❌ Admin ou produtos insuficientes. Rode os outros seeds primeiro.');
    process.exit(1);
  }
  // Limpar vendas antigas
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});

  // Datas de 10/07/2025 até 17/07/2025
  const start = new Date('2025-07-10T12:00:00.000Z');
  const end = new Date('2025-07-17T12:00:00.000Z');
  const datas = getDateRange(start, end);
  const metodos = ['dinheiro', 'cartao'];

  for (let i = 0; i < datas.length; i++) {
    // Seleciona 2-3 produtos diferentes para cada venda
    const itens = produtos.slice(i % (produtos.length - 1), (i % (produtos.length - 1)) + 2).map((p, idx) => ({
      nome: p.nome,
      preco: p.preco,
      quantidade: 1 + ((i + idx) % 3),
      productId: p.id
    }));
    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    await prisma.sale.create({
      data: {
        total,
        valorPago: total,
        troco: 0,
        vendedorId: admin.id,
        metodoPagamento: metodos[i % metodos.length],
        createdAt: datas[i],
        saleItems: { create: itens }
      }
    });
  }
  console.log('✅ Vendas de 10/07/2025 a 17/07/2025 inseridas!');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 