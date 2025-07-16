import Produto from '../models/Produto';

export async function listarProdutos(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [produtos, total] = await Promise.all([
    Produto.find().skip(skip).limit(limit),
    Produto.countDocuments()
  ]);
  return { sucesso: true, dados: { produtos, total, page, totalPages: Math.ceil(total / limit) } };
}

export async function criarProduto({ nome, preco, tipo, imagem }: any) {
  if (!nome || preco == null || !tipo) {
    return { sucesso: false, mensagem: 'Nome, preço e tipo são obrigatórios' };
  }
  const produto = new Produto({ nome, preco, tipo, imagem });
  await produto.save();
  return { sucesso: true, mensagem: 'Produto criado com sucesso', dados: produto };
}

export async function atualizarProduto(id: string, { nome, preco, tipo, imagem }: any) {
  const produto = await Produto.findByIdAndUpdate(
    id,
    { nome, preco, tipo, imagem },
    { new: true, runValidators: true }
  );
  if (!produto) return { sucesso: false, mensagem: 'Produto não encontrado' };
  return { sucesso: true, mensagem: 'Produto atualizado com sucesso', dados: produto };
}

export async function excluirProduto(id: string) {
  const produto = await Produto.findByIdAndDelete(id);
  if (!produto) return { sucesso: false, mensagem: 'Produto não encontrado' };
  return { sucesso: true, mensagem: 'Produto excluído com sucesso' };
} 