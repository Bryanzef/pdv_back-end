import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { autenticar, requerAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validation/validateBody';
import { produtoSchema } from '../validation/schemas';

const router = Router();

router.get('/', autenticar, productController.listarProdutos);
router.post('/', autenticar, requerAdmin, validateBody(produtoSchema), productController.criarProduto);
router.put('/:id', autenticar, requerAdmin, validateBody(produtoSchema), productController.atualizarProduto);
router.delete('/:id', autenticar, requerAdmin, productController.excluirProduto);

export default router;