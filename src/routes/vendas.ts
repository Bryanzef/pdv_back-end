import { Router } from 'express';
import * as vendaController from '../controllers/venda.controller';
import { autenticar } from '../middleware/auth';
import { validateBody } from '../middleware/validation/validateBody';
import { vendaSchema } from '../validation/schemas';

const router = Router();

router.get('/historico', autenticar, vendaController.listarHistoricoVendas);
router.get('/relatorio', autenticar, vendaController.gerarRelatorioVendas);
router.get('/', autenticar, vendaController.listarVendas);
router.get('/:id', autenticar, vendaController.buscarVendaPorId);
router.post('/', autenticar, validateBody(vendaSchema), vendaController.criarVenda);
router.delete('/:id', autenticar, vendaController.deletarVenda);

export default router; 