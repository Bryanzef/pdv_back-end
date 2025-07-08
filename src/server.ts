import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import produtoRoutes from './routes/produtos';
import vendaRoutes from './routes/vendas';
import authRoutes from './routes/auth';
import { apiLimiter } from './middleware/rateLimit';

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
app.use('/api', apiLimiter);


if (!process.env.MONGODB_URI) {
  console.error('❌ Erro: MONGODB_URI não está definida no arquivo .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas de autenticação (não precisam de autenticação)
app.use('/api/auth', authRoutes);

// Rotas protegidas
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