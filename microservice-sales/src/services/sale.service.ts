import * as saleRepository from '../repositories/sale.repository';
import * as externalService from './external.service';
import { ISaleRequest, ISale } from '../interfaces/ISale';

export const registerTransactionalSale = async (saleData: ISaleRequest, user_id: number): Promise<ISale> => {
    // Validar cliente consultando el microservicio de clientes
    const client = await externalService.getClientById(saleData.client_id);

    // Validar productos y obtener información del microservicio de productos
    const productsInfo = [];
    for (const item of saleData.products) {
        const product = await externalService.getProductById(item.product_id);
        
        if (product.stock_actual < item.quantity) {
            throw new Error(`Stock insuficiente para producto ID ${item.product_id}. Stock actual: ${product.stock_actual}, solicitado: ${item.quantity}`);
        }

        productsInfo.push({
            product: product,
            quantity: item.quantity
        });
    }

    // Crear la venta en la base de datos local
    const sale = await saleRepository.create(saleData, productsInfo, user_id);

    // Actualizar stock en el microservicio de productos
    // Si alguna actualización falla, la transacción local ya está commitada
    // En un escenario real, se podría implementar un patrón de compensación (Saga)
    try {
        for (const item of productsInfo) {
            await externalService.updateProductStock(item.product.id, item.quantity);
        }
    } catch (error: any) {
        console.error('Error al actualizar stock en el servicio de productos:', error.message);
        // Nota: La venta ya está registrada. En producción, se debería implementar un mecanismo de compensación
        throw new Error(`Venta registrada pero error al actualizar stock: ${error.message}`);
    }

    return sale;
};

export const findSaleById = async (id: number): Promise<any | undefined> => {
    const sale = await saleRepository.findById(id);
    return sale;
};

export const findAll = async (): Promise<any[]> => {
    return saleRepository.findAll();
};

