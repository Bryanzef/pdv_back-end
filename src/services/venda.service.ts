import Venda, { IVenda } from '../models/Venda';

export const criarVenda = async (dados: Partial<IVenda>) => {
  return await Venda.create(dados);
};

export const listarVendas = async () => {
  return await Venda.find().populate('usuario').populate('produtos.produtoId');
};

export const buscarVendaPorId = async (id: string) => {
  return await Venda.findById(id).populate('usuario').populate('produtos.produtoId');
};

export const deletarVenda = async (id: string) => {
  return await Venda.findByIdAndDelete(id);
}; 