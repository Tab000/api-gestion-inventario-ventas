import { Router } from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/product.controller';

const router = Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;