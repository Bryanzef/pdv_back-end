import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { loginLimiter, registroLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validation/validateBody';
import { loginSchema, registroSchema } from '../validation/schemas';

const router = Router();

router.post('/login', loginLimiter, validateBody(loginSchema), userController.login);
router.post('/registro', registroLimiter, validateBody(registroSchema), userController.register);
router.post('/logout', (req, res) => res.json({ sucesso: true, mensagem: 'Logout realizado com sucesso' }));
router.get('/me', userController.me);

export default router; 