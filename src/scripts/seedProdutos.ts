import prisma from '../lib/prisma';

const produtos = [
  { nome: 'Banana', preco: 4.99, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Maçã', preco: 6.49, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Laranja', preco: 5.29, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Abacaxi', preco: 7.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Melancia', preco: 12.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Uva', preco: 9.49, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Pera', preco: 8.99, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Manga', preco: 6.79, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Mamão', preco: 7.49, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Limão', preco: 3.99, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Cenoura', preco: 4.29, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Batata', preco: 3.89, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Tomate', preco: 5.59, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Alface', preco: 2.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Couve', preco: 2.49, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Brócolis', preco: 4.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Repolho', preco: 3.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Cebola', preco: 4.19, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Alho', preco: 19.99, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Pepino', preco: 3.49, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Beterraba', preco: 4.59, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Chuchu', preco: 2.99, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Abobrinha', preco: 3.79, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Quiabo', preco: 5.29, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Jiló', preco: 4.49, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Pimentão', preco: 6.19, categoria: 'peso', estoque: 100, ativo: true },
  { nome: 'Rúcula', preco: 2.99, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Espinafre', preco: 3.49, categoria: 'fixo', estoque: 100, ativo: true },
  { nome: 'Coco', preco: 7.99, categoria: 'fixo', estoque: 100, ativo: true }
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