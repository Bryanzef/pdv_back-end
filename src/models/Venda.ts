import mongoose, { Document, Schema } from 'mongoose';

interface IItem {
  nome: string;
  quantidade: number;
  preco: number;
  precoOriginal?: number;
  tipo: string;
  justificativa?: string;
  subtotal: number;
}

interface IVenda extends Document {
  data: Date;
  itens: IItem[];
  total: number;
  usuario?: mongoose.Types.ObjectId;
}

const itemSchema: Schema = new Schema<IItem>({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true },
  preco: { type: Number, required: true },
  precoOriginal: { type: Number },
  tipo: { type: String, required: true },
  justificativa: { type: String },
  subtotal: { type: Number, required: true }
});

const vendaSchema: Schema = new Schema<IVenda>({
  data: { type: Date, default: Date.now },
  itens: [itemSchema],
  total: { type: Number, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

export default mongoose.model<IVenda>('Venda', vendaSchema);