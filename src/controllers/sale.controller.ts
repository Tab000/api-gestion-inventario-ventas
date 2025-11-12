import { Request, Response } from 'express';
import * as saleService from '../services/sale.service';
import { ISaleRequest } from '../interfaces/ISale';

export const registerSale = async (req: Request, res: Response): Promise<void> => {

    const user_id = 1; 

    const saleData: ISaleRequest = req.body;

    if (!saleData.client_id || !saleData.products || saleData.products.length === 0) {
        res.status(400).json({ error: 'Faltan datos requeridos: client_id y products.' });
        return;
    }

    try {
        const newSale = await saleService.registerTransactionalSale(saleData, user_id);
        res.status(201).json({ 
            message: 'Venta registrada exitosamente (COMMIT)',
            sale: newSale 
        });
    } catch (error: any) {
        console.error('Error during sale transaction:', error.message);

        res.status(409).json({ 
            error: error.message,
            transaction_status: "ROLLBACK" 
        });
    }
};

export const getSaleById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID de venta inválido.' });
        return;
    }

    try {
        const sale = await saleService.findSaleById(id);
        if (sale) {
            res.status(200).json(sale);
        } else {
            res.status(404).json({ error: 'Venta no encontrada.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener el detalle de la venta.' });
    }
};