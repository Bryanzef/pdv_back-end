import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import produtoRoutes from './routes/produtos';
import usuarioRoutes from './routes/usuarios';
import vendaRoutes from './routes/vendas';

dotenv.config();

const app: Express = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
if (process.env.NODE_ENV !== 'development') {
  app.use('/api', apiLimiter);
}


if (!process.env.MONGODB_URI) {
  console.error('❌ Erro: MONGODB_URI não está definida no arquivo .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas de autenticação
app.use('/api/auth', authRoutes);
// Rotas de usuários
app.use('/api/usuarios', usuarioRoutes);
// Rotas de produtos
app.use('/api/produtos', produtoRoutes);
// Rotas de vendas
app.use('/api/vendas', vendaRoutes);
app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT as string) || 5000;


if (!process.env.NODE_ENV) {
  console.warn('⚠️  NODE_ENV não definido, usando "development" como padrão');
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});