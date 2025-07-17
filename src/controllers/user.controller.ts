
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
    const result = await userService.register(req.body, req.usuario);
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