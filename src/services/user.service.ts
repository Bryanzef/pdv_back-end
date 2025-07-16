import { gerarToken } from '../middleware/auth';
import Usuario from '../models/Usuario';

export async function login({ email, senha }: { email: string, senha: string }) {
  if (!email || !senha) {
    return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
  }
  const usuario = await Usuario.findOne({ email }).select('+senha');
  if (!usuario || !usuario.ativo) {
    return { sucesso: false, mensagem: 'Credenciais inválidas ou usuário inativo' };
  }
  const senhaValida = await usuario.compararSenha(senha);
  if (!senhaValida) {
    return { sucesso: false, mensagem: 'Credenciais inválidas' };
  }
  usuario.ultimoLogin = new Date();
  await usuario.save();
  const token = gerarToken(usuario);
  return { sucesso: true, mensagem: 'Login realizado com sucesso', dados: { usuario: usuario.toJSON(), token } };
}

export async function register({ nome, email, senha, role }: any, usuarioAtual: any) {
  if (!usuarioAtual || usuarioAtual.role !== 'admin') {
    return { sucesso: false, mensagem: 'Apenas admin pode criar usuários' };
  }
  if (!nome || !email || !senha) {
    return { sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' };
  }
  if (senha.length < 6) {
    return { sucesso: false, mensagem: 'Senha deve ter pelo menos 6 caracteres' };
  }
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return { sucesso: false, mensagem: 'Email já está em uso' };
  }
  const novoUsuario = new Usuario({ nome, email, senha, role });
  await novoUsuario.save();
  const token = gerarToken(novoUsuario);
  return { sucesso: true, mensagem: 'Usuário criado com sucesso', dados: { usuario: novoUsuario.toJSON(), token } };
}

export async function me(usuario: any) {
  if (!usuario) {
    return { sucesso: false, mensagem: 'Usuário não autenticado' };
  }
  return { sucesso: true, dados: { usuario } };
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
  const usuarioDb = await Usuario.findById(usuario._id).select('+senha');
  if (!usuarioDb) {
    return { sucesso: false, mensagem: 'Usuário não encontrado' };
  }
  const senhaAtualValida = await usuarioDb.compararSenha(senhaAtual);
  if (!senhaAtualValida) {
    return { sucesso: false, mensagem: 'Senha atual incorreta' };
  }
  usuarioDb.senha = novaSenha;
  await usuarioDb.save();
  return { sucesso: true, mensagem: 'Senha alterada com sucesso' };
}

export async function listarUsuarios(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [usuarios, total] = await Promise.all([
    Usuario.find().skip(skip).limit(limit),
    Usuario.countDocuments()
  ]);
  return { sucesso: true, dados: { usuarios, total, page, totalPages: Math.ceil(total / limit) } };
} 