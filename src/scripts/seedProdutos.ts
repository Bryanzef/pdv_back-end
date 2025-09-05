import prisma from '../lib/prisma';

const produtos = [
  { nome: 'Banana', preco: 4.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Maçã', preco: 6.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Laranja', preco: 5.29, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Abacaxi', preco: 7.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Melancia', preco: 12.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Uva', preco: 9.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Pera', preco: 8.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Manga', preco: 6.79, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Mamão', preco: 7.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Limão', preco: 3.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Cenoura', preco: 4.29, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Batata', preco: 3.89, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Tomate', preco: 5.59, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Alface', preco: 2.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Couve', preco: 2.49, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Brócolis', preco: 4.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Repolho', preco: 3.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Cebola', preco: 4.19, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Alho', preco: 19.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Pepino', preco: 3.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Beterraba', preco: 4.59, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Chuchu', preco: 2.99, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Abobrinha', preco: 3.79, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Quiabo', preco: 5.29, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Jiló', preco: 4.49, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Pimentão', preco: 6.19, categoria: 'peso', estoque: 100, ativo: true, tipo: 'peso' },
  { nome: 'Rúcula', preco: 2.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Espinafre', preco: 3.49, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' },
  { nome: 'Coco', preco: 7.99, categoria: 'fixo', estoque: 100, ativo: true, tipo: 'unidade' }
];

async function main() {
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.product.createMany({ data: produtos });
  console.log('✅ 30 produtos de exemplo inseridos!');
  process.exit(0);
}

main(); 