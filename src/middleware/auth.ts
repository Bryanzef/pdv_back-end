import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';

// Extendendo a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

// Interface para o payload do JWT
interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Middleware para verificar se o token JWT é válido
export const autenticar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pegar o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " do início

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não está definido no .env');
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    // Buscar o usuário no banco
    const usuario = await Usuario.findById(decoded.id).select('-senha');
    
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário inativo'
      });
    }

    // Adicionar o usuário ao request
    req.usuario = usuario;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token expirado'
      });
    }

    console.error('❌ Erro na autenticação:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário é admin
export const requerAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado - usuário não autenticado'
    });
  }

  if (req.usuario.role !== 'admin') {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado - permissão de administrador necessária'
    });
  }

  next();
};

// Middleware para verificar se o usuário tem pelo menos role de usuário
export const requerAutenticacao = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado - usuário não autenticado'
    });
  }

  next();
};

// Função para gerar token JWT
export const gerarToken = (usuario: IUsuario): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido');
  }

  const payload = {
    id: usuario._id,
    email: usuario.email,
    role: usuario.role
  };

  return jwt.sign(payload, secret, { expiresIn: '24h' });
}; 