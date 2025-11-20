import axios from 'axios';
import { SERVICES_CONFIG } from '../config/services.config';
import { IClient, IProduct } from '../interfaces/ISale';

export const getClientById = async (clientId: number): Promise<IClient> => {
    try {
        const response = await axios.get(`${SERVICES_CONFIG.CLIENTS_SERVICE_URL}/clients/${clientId}`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error(`Cliente con ID ${clientId} no encontrado.`);
        }
        throw new Error(`Error al consultar el servicio de clientes: ${error.message}`);
    }
};

export const getProductById = async (productId: number): Promise<IProduct> => {
    try {
        const response = await axios.get(`${SERVICES_CONFIG.PRODUCTS_SERVICE_URL}/products/${productId}`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error(`Producto con ID ${productId} no encontrado.`);
        }
        throw new Error(`Error al consultar el servicio de productos: ${error.message}`);
    }
};

export const updateProductStock = async (productId: number, quantity: number): Promise<void> => {
    try {
        await axios.patch(`${SERVICES_CONFIG.PRODUCTS_SERVICE_URL}/products/${productId}/stock`, {
            quantity: quantity
        });
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.error || 'Stock insuficiente para el producto.');
        }
        throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
    }
};

