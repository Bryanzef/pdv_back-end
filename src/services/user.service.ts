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

export async function register({ nome, email, senha, perfil }: any) {
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
  return { sucesso: true, mensagem: 'Usuário criado com sucesso', dados: { usuario: usuarioSemSenha } };
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

export async function buscarUsuarioPorId(id: string) {
  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) return { sucesso: false, mensagem: 'Usuário não encontrado' };
  const { senha, ...usuarioSemSenha } = usuario;
  return { sucesso: true, dados: { usuario: usuarioSemSenha } };
}

export async function editarUsuario(id: string, dados: any) {
  // Não permitir editar email para um já existente
  if (dados.email) {
    const usuarioExistente = await prisma.user.findUnique({ where: { email: dados.email } });
    if (usuarioExistente && usuarioExistente.id !== id) {
      return { sucesso: false, mensagem: 'Email já está em uso' };
    }
  }
  // Atualizar senha se fornecida
  let updateData: any = { ...dados };
  if (dados.senha) {
    if (dados.senha.length < 6) return { sucesso: false, mensagem: 'Senha deve ter pelo menos 6 caracteres' };
    updateData.senha = await bcrypt.hash(dados.senha, 10);
  } else {
    delete updateData.senha;
  }
  const usuarioEditado = await prisma.user.update({ where: { id }, data: updateData });
  const { senha, ...usuarioSemSenha } = usuarioEditado;
  return { sucesso: true, mensagem: 'Usuário editado com sucesso', dados: { usuario: usuarioSemSenha } };
}

export async function ativarUsuario(id: string) {
  const usuario = await prisma.user.update({ where: { id }, data: { ativo: true } });
  return { sucesso: true, mensagem: 'Usuário ativado com sucesso' };
}

export async function inativarUsuario(id: string) {
  const usuario = await prisma.user.update({ where: { id }, data: { ativo: false } });
  return { sucesso: true, mensagem: 'Usuário inativado com sucesso' };
}

export async function excluirUsuario(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { sucesso: true, mensagem: 'Usuário excluído com sucesso' };
  } catch (error: any) {
    if (error.code === 'P2003' || error.message?.includes('Foreign key')) {
      return { sucesso: false, mensagem: 'Não é possível excluir usuário vinculado a vendas ou logs de auditoria.' };
    }
    return { sucesso: false, mensagem: 'Erro ao excluir usuário', detalhes: error.message };
  }
}

// Função para registrar logs de auditoria
async function registrarLog(usuarioAutorId: string, usuarioAlvoId: string, acao: string) {
  await prisma.auditLog.create({
    data: {
      usuarioAutorId,
      usuarioAlvoId,
      acao,
      dataHora: new Date()
    }
  });
} 