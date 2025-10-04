import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import helmet from 'helmet';
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

// Configuração de CORS para desenvolvimento e produção
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // React dev server alternativo
  process.env.FRONTEND_URL, // URL do frontend em produção
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null, // Vercel
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Origin não permitida: ${origin}`);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
if (process.env.NODE_ENV !== 'development') {
  app.use('/api', apiLimiter);
}

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
  console.log('✅ Backend conectado ao PostgreSQL via Prisma');
  console.log('🔗 Certifique-se que o frontend está rodando em http://localhost:5173 e o backend em http://localhost:' + PORT);
});