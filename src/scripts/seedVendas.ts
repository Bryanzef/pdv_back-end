import prisma from '../lib/prisma';

async function main() {
  // Buscar admin e produtos
  const admin = await prisma.user.findFirst({ where: { perfil: 'admin' } });
  const produtos = await prisma.product.findMany({ take: 3 });
  if (!admin || produtos.length < 3) {
    console.error('❌ Admin ou produtos insuficientes. Rode os outros seeds primeiro.');
    process.exit(1);
  }
  // Limpar vendas antigas
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  // Criar vendas de exemplo
  for (let i = 0; i < 3; i++) {
    const itens = produtos.map((p, idx) => ({
      nome: p.nome,
      preco: p.preco,
      quantidade: 1 + i + idx,
      productId: p.id
    }));
    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    await prisma.sale.create({
      data: {
        total,
        vendedorId: admin.id,
        metodoPagamento: 'dinheiro',
        createdAt: new Date(Date.now() - i * 86400000),
        saleItems: { create: itens }
      }
    });
  }
  console.log('✅ Vendas de exemplo inseridas!');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 