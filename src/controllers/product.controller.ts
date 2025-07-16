import { NextFunction, Request, Response } from 'express';
import * as productService from '../services/product.service';

export async function listarProdutos(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    const result = await productService.listarProdutos(Number(page), Number(limit));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function criarProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.criarProduto(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function atualizarProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.atualizarProduto(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function excluirProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.excluirProduto(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
} 