import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Parâmetros de consulta inválidos',
        erros: result.error.issues
      });
    }
    req.query = result.data;
    next();
  };
} 