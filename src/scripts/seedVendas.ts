import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Produto from '../models/Produto';
import Usuario from '../models/Usuario';
import Venda from '../models/Venda';

dotenv.config();

const seedVendas = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI não está definida no arquivo .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    const produtos = await Produto.find().limit(10);
    const admin = await Usuario.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ Nenhum usuário admin encontrado. Execute o script criarAdmin primeiro.');
      process.exit(1);
    }
    if (produtos.length < 3) {
      console.error('❌ Poucos produtos para criar vendas. Execute o seedProdutos primeiro.');
      process.exit(1);
    }

    await Venda.deleteMany({});

    const vendas = Array.from({ length: 5 }).map((_, i) => {
      const itens = [
        {
          nome: produtos[0].nome,
          quantidade: 2 + i,
          preco: produtos[0].preco,
          tipo: produtos[0].tipo,
          subtotal: produtos[0].preco * (2 + i)
        },
        {
          nome: produtos[1].nome,
          quantidade: 1,
          preco: produtos[1].preco,
          tipo: produtos[1].tipo,
          subtotal: produtos[1].preco * 1
        },
        {
          nome: produtos[2].nome,
          quantidade: 3,
          preco: produtos[2].preco,
          tipo: produtos[2].tipo,
          subtotal: produtos[2].preco * 3
        }
      ];
      return {
        data: new Date(Date.now() - i * 86400000),
        itens,
        total: itens.reduce((acc, item) => acc + item.subtotal, 0),
        usuario: admin._id
      };
    });

    await Venda.insertMany(vendas);
    console.log('✅ 5 vendas inseridas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inserir vendas:', error);
    process.exit(1);
  }
};

seedVendas(); 