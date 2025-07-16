import mongoose, { Document, Schema } from 'mongoose';

export interface IVenda extends Document {
  produtos: Array<{
    produtoId: mongoose.Types.ObjectId;
    quantidade: number;
    precoUnitario: number;
  }>;
  total: number;
  data: Date;
  cliente?: string;
  usuario: mongoose.Types.ObjectId;
}

const VendaSchema = new Schema<IVenda>({
  produtos: [
    {
      produtoId: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
      quantidade: { type: Number, required: true },
      precoUnitario: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  cliente: { type: String },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

export default mongoose.model<IVenda>('Venda', VendaSchema); 