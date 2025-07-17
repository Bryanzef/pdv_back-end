import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';


declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export const autenticar = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔒 [auth] Iniciando autenticação');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔒 [auth] Token não fornecido');
      return res.status(401).json({ sucesso: false, mensagem: 'Token de acesso não fornecido' });
    }
    const token = authHeader.substring(7);
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não está definido no .env');
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      console.log('🔒 [auth] Token decodificado:', decoded);
    } catch (err) {
      console.log('🔒 [auth] Erro ao decodificar token:', err);
      throw err;
    }
    // Buscar usuário via Prisma
    const usuario = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true }
    });
    if (!usuario) {
      console.log('🔒 [auth] Usuário não encontrado');
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }
    if (!usuario.ativo) {
      console.log('🔒 [auth] Usuário inativo');
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário inativo' });
    }
    req.usuario = usuario;
    console.log('🔒 [auth] Usuário autenticado:', usuario);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('🔒 [auth] Token inválido');
      return res.status(401).json({ sucesso: false, mensagem: 'Token inválido' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      console.log('🔒 [auth] Token expirado');
      return res.status(401).json({ sucesso: false, mensagem: 'Token expirado' });
    }
    console.error('❌ Erro na autenticação:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

export const requerAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'Acesso negado - usuário não autenticado' });
  }
  if (req.usuario.perfil !== 'admin') {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso negado - permissão de administrador necessária' });
  }
  next();
};

export const requerAutenticacao = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ sucesso: false, mensagem: 'Acesso negado - usuário não autenticado' });
  }
  next();
};

export const gerarToken = (usuario: any): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido');
  }
  const payload = {
    id: usuario.id,
    email: usuario.email,
    role: usuario.perfil
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}; 