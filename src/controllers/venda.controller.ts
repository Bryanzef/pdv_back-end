import { Request, Response } from 'express';
import * as vendaService from '../services/venda.service';

export const criarVenda = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    const venda = await vendaService.criarVenda({ ...req.body, usuario: req.usuario });
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

export const listarHistoricoVendas = async (req: Request, res: Response) => {
  console.log('📜 [controller] Acessando listarHistoricoVendas', req.usuario);
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const historico = await vendaService.listarHistoricoVendas(page, limit);
    res.json(historico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar histórico de vendas', detalhes: error });
  }
};

export const gerarRelatorioVendas = async (req: Request, res: Response) => {
  console.log('📊 [controller] Acessando gerarRelatorioVendas', req.usuario);
  try {
    const { inicio, fim } = req.query;
    if (!inicio || !fim) {
      return res.status(400).json({ erro: 'Informe o período inicial e final' });
    }
    const relatorio = await vendaService.gerarRelatorioVendas(String(inicio), String(fim));
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar relatório de vendas', detalhes: error });
  }
}; 