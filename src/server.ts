import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import produtoRoutes from './routes/produtos';
import vendaRoutes from './routes/vendas';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin@cluster0.lacxwfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/produtos', produtoRoutes);
app.use('/api/vendas', vendaRoutes);

const PORT: number = parseInt(process.env.PORT as string) || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));