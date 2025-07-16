import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { autenticar } from '../middleware/auth';
import { loginLimiter, registroLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validation/validateBody';
import { loginSchema, registroSchema } from '../validation/schemas';

const router = Router();

router.post('/login', loginLimiter, validateBody(loginSchema), userController.login);
router.post('/registro', registroLimiter, validateBody(registroSchema), userController.register);
router.post('/logout', autenticar, (req, res) => res.json({ sucesso: true, mensagem: 'Logout realizado com sucesso' }));

export default router; 