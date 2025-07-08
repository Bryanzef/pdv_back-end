import { Router, Request, Response } from 'express';
import Venda from '../models/Venda';
import { autenticar, requerAdmin } from '../middleware/auth';

const router: Router = Router();

// Listar vendas - qualquer usuário autenticado pode ver
router.get('/', autenticar, async (req: Request, res: Response) => {
  try {
    const vendas = await Venda.find();
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});

// Cadastrar venda - qualquer usuário autenticado pode criar
router.post('/', autenticar, async (req: Request, res: Response) => {
  try {
    const venda = new Venda(req.body);
    await venda.save();
    res.status(201).json(venda);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar venda' });
  }
});

// Excluir venda - apenas admin pode excluir
router.delete('/:id', autenticar, requerAdmin, async (req: Request, res: Response) => {
  try {
    const venda = await Venda.findByIdAndDelete(req.params.id);
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json({ message: 'Venda excluída' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir venda' });
  }
});

export default router;