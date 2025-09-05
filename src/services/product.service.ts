import prisma from '../lib/prisma';

export async function listarProdutos(page = 1, limit = 10) {
  // Garante que page e limit são inteiros positivos
  page = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  limit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const skip = (page - 1) * limit;

  const [produtos, total] = await Promise.all([
    prisma.product.findMany({ skip, take: limit }),
    prisma.product.count()
  ]);

  const produtosCompat = produtos.map((p) => ({
    _id: p.id,
    nome: p.nome,
    preco: p.preco,
    tipo: p.categoria, // padronizado para 'tipo'
    estoque: p.estoque,
    ativo: p.ativo
  }));
  return { success: true, dados: { produtos: produtosCompat, total, page, totalPages: Math.ceil(total / limit) } };
}

export async function criarProduto({ nome, preco, tipo, estoque }: any) {
  if (!nome || preco == null || !tipo) {
    return { success: false, message: 'Nome, preço e tipo são obrigatórios' };
  }
  const produto = await prisma.product.create({ data: { nome, preco, categoria: tipo, estoque: estoque ?? 100, tipo } });
  const produtoCompat = { _id: produto.id, nome: produto.nome, preco: produto.preco, tipo: produto.tipo, estoque: produto.estoque, ativo: produto.ativo };
  return { success: true, message: 'Produto criado com sucesso', dados: produtoCompat };
}

export async function atualizarProduto(id: string, { nome, preco, tipo, estoque }: any) {
  const produto = await prisma.product.update({
    where: { id },
    data: { nome, preco, categoria: tipo, estoque: estoque ?? 100 }
  });
  if (!produto) return { success: false, message: 'Produto não encontrado' };
  const produtoCompat = { _id: produto.id, nome: produto.nome, preco: produto.preco, tipo: produto.categoria, estoque: produto.estoque, ativo: produto.ativo };
  return { success: true, message: 'Produto atualizado com sucesso', dados: produtoCompat };
}

export async function excluirProduto(id: string) {
  const produto = await prisma.product.delete({ where: { id } });
  if (!produto) return { success: false, message: 'Produto não encontrado' };
  return { success: true, message: 'Produto excluído com sucesso' };
} 