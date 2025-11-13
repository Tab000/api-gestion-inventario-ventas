import { Router, Request, Response } from 'express';
import { ISaleRequest } from '../interfaces/ISale';
import * as SaleRepository from '../repositories/sale.repository';
import * as ClientRepository from '../repositories/client.repository';

const router = Router();

const validateSaleRequest = async (req: Request, res: Response, next: Function) => {
    const saleData: ISaleRequest = req.body;

    if (!saleData.client_id || !Array.isArray(saleData.products) || saleData.products.length === 0) {
        return res.status(400).json({ error: 'Datos de venta inválidos: client_id y products (array no vacío) son requeridos.' });
    }

    try {

        const client = await ClientRepository.findById(saleData.client_id);
        if (!client) {
            return res.status(404).json({ error: `Cliente con ID ${saleData.client_id} no encontrado.` });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno al verificar el cliente.' });
    }

    for (const item of saleData.products) {
        if (!item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).json({ error: 'Cada item de producto debe tener un product_id válido y una quantity positiva.' });
        }
    }
    
    next();
};

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de venta inválido.' });
    }

    try {
        const sale = await SaleRepository.findById(id);

        if (!sale) {
            return res.status(404).json({ error: `Venta con ID ${id} no encontrada.` });
        }
        
        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la venta por ID.', details: (error as Error).message });
    }
});

router.post('/', validateSaleRequest, async (req: Request, res: Response) => {
    try {
        const sale = await SaleRepository.create(req.body);
        res.status(201).json(sale);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'transaction_status' in error) {
            const err = error as { error: string, transaction_status: string };
            
            let status = 500;
            if (err.error.includes('Stock insuficiente')) {
                status = 400; 
            } else if (err.error.includes('FOREIGN KEY constraint failed')) {
                status = 404;
            } else {
                status = 409; 
            }

            return res.status(status).json(err);
        }

        res.status(500).json({ error: 'Error interno al procesar la venta.', details: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const sales = await SaleRepository.findAll();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de ventas.' });
    }
});

export default router;