import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { IProductRequest } from '../interfaces/IProduct';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const productData: IProductRequest = req.body;

    if (!productData.name || !productData.code_sku || !productData.price_unit) {
        res.status(400).json({ error: 'Faltan campos obligatorios para el producto.' });
        return;
    }

    try {
        const newProduct = await productService.create(productData);
        res.status(201).json(newProduct);
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'El SKU ya está registrado.' });
        } else {
            res.status(500).json({ error: 'Error interno al crear el producto.' });
        }
    }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await productService.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al obtener los productos.' });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID de producto inválido.' });
        return;
    }

    try {
        const product = await productService.findById(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno al obtener el producto.' });
    }
};