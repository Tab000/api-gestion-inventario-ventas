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

export const updateProductStock = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (isNaN(id) || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: 'ID de producto inválido o cantidad inválida.' });
        return;
    }

    try {
        const product = await productService.findById(id);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        if (product.stock_actual < quantity) {
            res.status(400).json({ 
                error: `Stock insuficiente. Stock actual: ${product.stock_actual}, solicitado: ${quantity}` 
            });
            return;
        }

        await productService.updateStock(id, quantity);
        const updatedProduct = await productService.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al actualizar el stock del producto.' });
    }
};

