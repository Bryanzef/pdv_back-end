import { Request, Response, Router } from 'express';
import { autenticar, gerarToken, requerAdmin } from '../middleware/auth';
import { loginLimiter, registroLimiter } from '../middleware/rateLimit';
import Usuario from '../models/Usuario';

const router = Router();

// Interface para validação de entrada
interface LoginRequest {
  email: string;
  senha: string;
}

interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  role?: 'admin' | 'usuario';
}

// POST /api/auth/login - Login do usuário
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, senha }: LoginRequest = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário inativo'
      });
    }

    // Verificar senha
    const senhaValida = await usuario.compararSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    // Atualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();

    // Gerar token JWT
    const token = gerarToken(usuario);

    // Retornar resposta sem a senha
    const usuarioSemSenha = usuario.toJSON();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      dados: {
        usuario: usuarioSemSenha,
        token
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/registro - Registro de novo usuário (apenas admin pode criar outros admins)
router.post('/registro', registroLimiter, autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, role = 'usuario' }: RegistroRequest = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, email e senha são obrigatórios'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email já está em uso'
      });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      role
    });

    await novoUsuario.save();

    // Gerar token JWT
    const token = gerarToken(novoUsuario);

    // Retornar resposta sem a senha
    const usuarioSemSenha = novoUsuario.toJSON();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      dados: {
        usuario: usuarioSemSenha,
        token
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);

    // Tratar erros de validação do Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
      const mensagens = Object.values((error as any).errors).map((err: any) => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: mensagens
      });
    }

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', autenticar, async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: {
        usuario: req.usuario
      }
    });

  } catch (error) {
    console.error('❌ Erro ao obter dados do usuário:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/logout - Logout (cliente deve remover o token)
router.post('/logout', autenticar, async (req: Request, res: Response) => {
  try {
    // Em uma implementação mais robusta, você poderia adicionar o token a uma blacklist
    // Por enquanto, apenas retornamos sucesso e o cliente remove o token

    res.status(200).json({
      sucesso: true,
      mensagem: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no logout:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/alterar-senha - Alterar senha do usuário logado
router.post('/alterar-senha', autenticar, async (req: Request, res: Response) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Buscar usuário com senha
    const usuario = await Usuario.findById(req.usuario?._id).select('+senha');

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const senhaAtualValida = await usuario.compararSenha(senhaAtual);

    if (!senhaAtualValida) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    usuario.senha = novaSenha;
    await usuario.save();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/usuarios - Listar usuários (apenas admin)
router.get('/usuarios', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const [usuarios, total] = await Promise.all([
      Usuario.find().skip(skip).limit(limit),
      Usuario.countDocuments()
    ]);
    res.json({ data: usuarios, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

export default router; 