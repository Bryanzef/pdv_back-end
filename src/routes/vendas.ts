import { Router } from 'express';
import * as vendaController from '../controllers/venda.controller';
import { autenticar } from '../middleware/auth';

const router = Router();

router.get('/', autenticar, vendaController.listarVendas);
router.get('/:id', autenticar, vendaController.buscarVendaPorId);
router.post('/', autenticar, vendaController.criarVenda);
router.delete('/:id', autenticar, vendaController.deletarVenda);

export default router; 