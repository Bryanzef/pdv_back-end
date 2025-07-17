import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateBody } from '../middleware/validation/validateBody';
import { produtoSchema } from '../validation/schemas';

const router = Router();

router.get('/', productController.listarProdutos);
router.post('/', validateBody(produtoSchema), productController.criarProduto);
router.put('/:id', validateBody(produtoSchema), productController.atualizarProduto);
router.delete('/:id', productController.excluirProduto);

export default router;