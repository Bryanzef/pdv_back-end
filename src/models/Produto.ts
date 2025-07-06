import mongoose, { Schema, Document } from 'mongoose';

interface IProduto extends Document {
  nome: string;
  preco: number;
  tipo: 'peso' | 'fixo';
  imagem: string;
}

const produtoSchema: Schema = new Schema<IProduto>({
  nome: { type: String, required: true, unique: true },
  preco: { type: Number, required: true, min: 0 },
  tipo: { type: String, enum: ['peso', 'fixo'], required: true },
  imagem: { type: String, default: '📦' }
});

export default mongoose.model<IProduto>('Produto', produtoSchema);