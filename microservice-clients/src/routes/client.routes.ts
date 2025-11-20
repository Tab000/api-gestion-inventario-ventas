import { Router } from 'express';
import { createClient, getAllClients, getClientById } from '../controllers/client.controller';

const router = Router();

router.post('/', createClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);

export default router;

