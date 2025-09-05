import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';

async function main() {
  // Seed Admin
  const adminEmail = 'admin@fruteira.com';
  const adminSenha = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador',
      email: adminEmail,
      senha: adminSenha,
      perfil: 'admin',
      ativo: true
    }
  });

  // Seed Produtos
  const produtos = [
    { nome: 'Banana', preco: 4.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
    { nome: 'Maçã', preco: 6.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
    { nome: 'Laranja', preco: 5.29, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
    { nome: 'Abacaxi', preco: 7.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
    { nome: 'Melancia', preco: 12.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' }
  ];
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.product.createMany({ data: produtos });

  // Seed Vendas
  const produtosDb = await prisma.product.findMany({ take: 3 });
  for (let i = 0; i < 3; i++) {
    const itens = produtosDb.map((p, idx) => ({
      nome: p.nome,
      preco: p.preco,
      quantidade: 1 + i + idx,
      productId: p.id
    }));
    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    await prisma.sale.create({
      data: {
        total,
        valorPago: total,
        vendedorId: admin.id,
        metodoPagamento: 'dinheiro',
        createdAt: new Date(Date.now() - i * 86400000),
        saleItems: { create: itens }
      }
    });
  }

  console.log('✅ Seed concluído com admin, produtos e vendas de exemplo!');
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});