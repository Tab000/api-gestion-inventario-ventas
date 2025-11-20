import { Router } from 'express';
import { registerSale, getSaleById, getAllSales } from '../controllers/sale.controller';

const router = Router();

router.post('/', registerSale);
router.get('/', getAllSales);
router.get('/:id', getSaleById);

export default router;

