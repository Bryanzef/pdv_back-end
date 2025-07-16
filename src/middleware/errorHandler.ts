import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error('Erro não tratado:', err);
  const status = err.status || 500;
  res.status(status).json({
    sucesso: false,
    mensagem: err.message || 'Erro interno do servidor',
    erros: err.errors || undefined
  });
} 