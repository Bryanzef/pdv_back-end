import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { autenticar, requerAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validation/validateBody';
import { loginSchema } from '../validation/schemas';

const router = Router();

router.get('/', autenticar, requerAdmin, userController.listarUsuarios);
router.get('/me', autenticar, userController.me);
router.post('/alterar-senha', autenticar, validateBody(loginSchema), userController.alterarSenha);

export default router; 