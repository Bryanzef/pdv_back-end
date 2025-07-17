import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { gerarToken } from '../middleware/auth';

export async function login({ email, senha }: { email: string, senha: string }) {
  if (!email || !senha) {
    return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
  }
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario || !usuario.ativo) {
    return { sucesso: false, mensagem: 'Credenciais inválidas ou usuário inativo' };
  }
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return { sucesso: false, mensagem: 'Credenciais inválidas' };
  }
  await prisma.user.update({ where: { id: usuario.id }, data: { updatedAt: new Date() } });
  const { senha: _, ...usuarioSemSenha } = usuario;
  const token = gerarToken(usuario);
  // Compatibilidade: garantir que o campo 'role' exista
  const usuarioCompat = { ...usuarioSemSenha, role: usuario.perfil };
  return { sucesso: true, mensagem: 'Login realizado com sucesso', dados: { usuario: usuarioCompat, token } };
}

export async function register({ nome, email, senha, perfil }: any, usuarioAtual: any) {
  if (!usuarioAtual || usuarioAtual.perfil !== 'admin') {
    return { sucesso: false, mensagem: 'Apenas admin pode criar usuários' };
  }
  if (!nome || !email || !senha) {
    return { sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' };
  }
  if (senha.length < 6) {
    return { sucesso: false, mensagem: 'Senha deve ter pelo menos 6 caracteres' };
  }
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) {
    return { sucesso: false, mensagem: 'Email já está em uso' };
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  const novoUsuario = await prisma.user.create({ data: { nome, email, senha: senhaHash, perfil: perfil || 'usuario', ativo: true } });
  const { senha: _, ...usuarioSemSenha } = novoUsuario;
  const token = gerarToken(novoUsuario);
  return { sucesso: true, mensagem: 'Usuário criado com sucesso', dados: { usuario: usuarioSemSenha, token } };
}

export async function me(usuario: any) {
  if (!usuario) {
    return { sucesso: false, mensagem: 'Usuário não autenticado' };
  }
  // Compatibilidade: garantir que o campo 'role' exista
  const usuarioCompat = { ...usuario, role: usuario.perfil };
  return { sucesso: true, dados: { usuario: usuarioCompat } };
}

export async function alterarSenha(usuario: any, { senhaAtual, novaSenha }: any) {
  if (!usuario) {
    return { sucesso: false, mensagem: 'Usuário não autenticado' };
  }
  if (!senhaAtual || !novaSenha) {
    return { sucesso: false, mensagem: 'Senha atual e nova senha são obrigatórias' };
  }
  if (novaSenha.length < 6) {
    return { sucesso: false, mensagem: 'Nova senha deve ter pelo menos 6 caracteres' };
  }
  const usuarioDb = await prisma.user.findUnique({ where: { id: usuario.id } });
  if (!usuarioDb) {
    return { sucesso: false, mensagem: 'Usuário não encontrado' };
  }
  const senhaAtualValida = await bcrypt.compare(senhaAtual, usuarioDb.senha);
  if (!senhaAtualValida) {
    return { sucesso: false, mensagem: 'Senha atual incorreta' };
  }
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.user.update({ where: { id: usuario.id }, data: { senha: senhaHash } });
  return { sucesso: true, mensagem: 'Senha alterada com sucesso' };
}

export async function listarUsuarios(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [usuarios, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, select: { id: true, nome: true, email: true, perfil: true, ativo: true, createdAt: true, updatedAt: true } }),
    prisma.user.count()
  ]);
  return { sucesso: true, dados: { usuarios, total, page, totalPages: Math.ceil(total / limit) } };
} 