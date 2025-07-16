import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, 'Senha obrigatória')
});

export const registroSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'usuario']).optional()
});

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  preco: z.number().positive('Preço deve ser positivo'),
  tipo: z.enum(['peso', 'fixo']),
  imagem: z.string().optional()
});

export const vendaSchema = z.object({
  itens: z.array(z.object({
    nome: z.string(),
    quantidade: z.number().positive(),
    preco: z.number().positive(),
    precoOriginal: z.number().positive().optional(),
    tipo: z.string(),
    justificativa: z.string().optional(),
    subtotal: z.number().positive()
  })),
  total: z.number().positive()
}); 