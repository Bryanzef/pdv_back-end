import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import produtoRoutes from './routes/produtos';
import vendaRoutes from './routes/vendas';

dotenv.config();

const app: Express = express();
app.use(express.json());


if (!process.env.MONGODB_URI) {
  console.error('❌ Erro: MONGODB_URI não está definida no arquivo .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

app.use('/api/produtos', produtoRoutes);
app.use('/api/vendas', vendaRoutes);

const PORT: number = parseInt(process.env.PORT as string) || 5000;


if (!process.env.NODE_ENV) {
  console.warn('⚠️  NODE_ENV não definido, usando "development" como padrão');
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});