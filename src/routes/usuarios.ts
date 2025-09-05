import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validateBody } from '../middleware/validation/validateBody';
import { loginSchema } from '../validation/schemas';

const router = Router();

router.get('/', userController.listarUsuarios);
router.get('/me', userController.me);
router.post('/alterar-senha', validateBody(loginSchema), userController.alterarSenha);
router.get('/:id', userController.buscarUsuarioPorId);
router.put('/:id', userController.editarUsuario);
router.patch('/:id/ativar', userController.ativarUsuario);
router.patch('/:id/inativar', userController.inativarUsuario);
router.delete('/:id', userController.excluirUsuario);

export default router; 