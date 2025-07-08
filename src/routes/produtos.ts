import { Router, Request, Response } from 'express';
import Produto from '../models/Produto';
import { autenticar, requerAdmin } from '../middleware/auth';

const router: Router = Router();

// Listar produtos - qualquer usuário autenticado pode ver
router.get('/', autenticar, async (req: Request, res: Response) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// Cadastrar produto - apenas admin pode criar
router.post('/', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const { nome, preco, tipo, imagem } = req.body;
    const produto = new Produto({ nome, preco, tipo, imagem });
    await produto.save();
    res.status(201).json(produto);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar produto - apenas admin pode editar
router.put('/:id', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const { nome, preco, tipo, imagem } = req.body;
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      { nome, preco, tipo, imagem },
      { new: true, runValidators: true }
    );
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Excluir produto - apenas admin pode excluir
router.delete('/:id', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

export default router;