import prisma from '../lib/prisma';

async function main() {
  // Atualiza produtos de categoria 'peso'
  await prisma.product.updateMany({
    where: { categoria: 'peso' },
    data: { tipo: 'peso' }
  });

  // Atualiza produtos de categoria 'fixo'
  await prisma.product.updateMany({
    where: { categoria: 'fixo' },
    data: { tipo: 'unidade' }
  });

  console.log('✅ Produtos atualizados com o campo tipo!');
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
}); 