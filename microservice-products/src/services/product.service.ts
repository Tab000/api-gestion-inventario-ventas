import * as productRepository from '../repositories/product.repository';
import { IProduct, IProductRequest } from '../interfaces/IProduct';

const addAlertStatus = (product: IProduct): IProduct => {
    product.alert_stock = product.stock_actual <= product.stock_minimo;
    return product;
};

export const create = async (productData: IProductRequest): Promise<IProduct> => {
    const newProduct = await productRepository.create(productData);
    return addAlertStatus(newProduct);
};

export const findAll = async (): Promise<IProduct[]> => {
    const products = await productRepository.findAll();
    return products.map(addAlertStatus);
};

export const findById = async (id: number): Promise<IProduct | undefined> => {
    const product = await productRepository.findById(id);
    if (product) {
        return addAlertStatus(product);
    }
    return undefined;
};

export const updateStock = async (productId: number, quantity: number): Promise<void> => {
    return productRepository.updateStock(productId, quantity);
};

