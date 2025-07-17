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
  tipo: z.enum(['peso', 'fixo'])
});

const decimal2 = z.preprocess(
  (a) => typeof a === 'string' || typeof a === 'number' ? Number(a) : a,
  z.number().positive().refine(val => Number.isFinite(val) && Math.round(val * 100) === val * 100, { message: 'Deve ter 2 casas decimais' })
);

export const vendaSchema = z.object({
  itens: z.array(z.object({
    nome: z.string(),
    quantidade: z.number().positive(),
    preco: decimal2,
    precoOriginal: decimal2.optional(),
    tipo: z.string().optional(),
    justificativa: z.string().optional(),
    subtotal: decimal2.optional(),
    productId: z.string()
  })),
  total: decimal2,
  pagamento: z.object({
    forma: z.string().min(1, 'Forma de pagamento obrigatória'),
    valorPago: decimal2,
    troco: decimal2.optional(),
    parcelas: z.number().optional()
  })
}); 