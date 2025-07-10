import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Produto from '../models/Produto';

dotenv.config();

const produtos = [
  { nome: 'Banana', preco: 4.99, tipo: 'peso', imagem: '🍌' },
  { nome: 'Maçã', preco: 6.49, tipo: 'peso', imagem: '🍎' },
  { nome: 'Laranja', preco: 5.29, tipo: 'peso', imagem: '🍊' },
  { nome: 'Abacaxi', preco: 7.99, tipo: 'fixo', imagem: '🍍' },
  { nome: 'Melancia', preco: 12.99, tipo: 'fixo', imagem: '🍉' },
  { nome: 'Uva', preco: 9.99, tipo: 'peso', imagem: '🍇' },
  { nome: 'Pera', preco: 8.49, tipo: 'peso', imagem: '🍐' },
  { nome: 'Mamão', preco: 6.99, tipo: 'fixo', imagem: '🍈' },
  { nome: 'Limão', preco: 3.99, tipo: 'peso', imagem: '🍋' },
  { nome: 'Cenoura', preco: 2.99, tipo: 'peso', imagem: '🥕' },
  { nome: 'Batata', preco: 3.49, tipo: 'peso', imagem: '🥔' },
  { nome: 'Tomate', preco: 5.99, tipo: 'peso', imagem: '🍅' },
  { nome: 'Alface', preco: 2.49, tipo: 'fixo', imagem: '🥬' },
  { nome: 'Cebola', preco: 4.29, tipo: 'peso', imagem: '🧅' },
  { nome: 'Manga', preco: 7.49, tipo: 'fixo', imagem: '🥭' },
  { nome: 'Coco', preco: 6.59, tipo: 'fixo', imagem: '🥥' },
  { nome: 'Morango', preco: 10.99, tipo: 'peso', imagem: '🍓' },
  { nome: 'Kiwi', preco: 8.99, tipo: 'fixo', imagem: '🥝' },
  { nome: 'Pepino', preco: 3.79, tipo: 'peso', imagem: '🥒' },
  { nome: 'Beterraba', preco: 4.59, tipo: 'peso', imagem: '🫒' }
];

const seedProdutos = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI não está definida no arquivo .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    await Produto.deleteMany({});
    await Produto.insertMany(produtos);
    console.log('✅ 20 produtos inseridos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inserir produtos:', error);
    process.exit(1);
  }
};

seedProdutos(); 