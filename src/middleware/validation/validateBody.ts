import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: result.error.issues
      });
    }
    req.body = result.data;
    next();
  };
} 