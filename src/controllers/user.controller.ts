
import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.me(req.usuario);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function alterarSenha(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.alterarSenha(req.usuario, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listarUsuarios(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    const result = await userService.listarUsuarios(Number(page), Number(limit));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function buscarUsuarioPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.buscarUsuarioPorId(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function editarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.editarUsuario(req.params.id, req.body);
    if (!result.sucesso) return res.status(200).json(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor', detalhes: err });
  }
}

export async function ativarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.ativarUsuario(req.params.id);
    if (!result.sucesso) return res.status(200).json(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor', detalhes: err });
  }
}

export async function inativarUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.inativarUsuario(req.params.id);
    if (!result.sucesso) return res.status(200).json(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor', detalhes: err });
  }
}

export async function excluirUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.excluirUsuario(req.params.id);
    if (!result.sucesso && result.mensagem?.includes('vinculado')) {
      return res.status(409).json(result);
    }
    if (!result.sucesso) return res.status(200).json(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor', detalhes: err });
  }
} 