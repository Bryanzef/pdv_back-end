import { Request, Response } from 'express';
import * as vendaService from '../services/venda.service';

export const criarVenda = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    const venda = await vendaService.criarVenda({ ...req.body, usuario: req.usuario._id });
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar venda', detalhes: error });
  }
};

export const listarVendas = async (_req: Request, res: Response) => {
  try {
    const vendas = await vendaService.listarVendas();
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar vendas', detalhes: error });
  }
};

export const buscarVendaPorId = async (req: Request, res: Response) => {
  try {
    const venda = await vendaService.buscarVendaPorId(req.params.id);
    if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' });
    res.json(venda);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar venda', detalhes: error });
  }
};

export const deletarVenda = async (req: Request, res: Response) => {
  try {
    const venda = await vendaService.deletarVenda(req.params.id);
    if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' });
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar venda', detalhes: error });
  }
}; 