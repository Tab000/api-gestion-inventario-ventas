import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProductStock } from '../controllers/product.controller';

const router = Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.patch('/:id/stock', updateProductStock);

export default router;

