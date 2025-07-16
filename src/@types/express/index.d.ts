import { IUsuario } from '../../models/Usuario';

declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
} 