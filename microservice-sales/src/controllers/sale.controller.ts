import { Request, Response } from 'express';
import * as saleService from '../services/sale.service';
import { ISaleRequest } from '../interfaces/ISale';
import * as saleRepository from '../repositories/sale.repository';

export const registerSale = async (req: Request, res: Response): Promise<void> => {
    const user_id = 1; // En producción, esto vendría del token de autenticación

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

        let statusCode = 409;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('Stock insuficiente')) {
            statusCode = 400;
        }

        res.status(statusCode).json({ 
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

export const getAllSales = async (req: Request, res: Response): Promise<void> => {
    try {
        const sales = await saleRepository.findAll();
        res.status(200).json(sales);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener la lista de ventas.' });
    }
};

