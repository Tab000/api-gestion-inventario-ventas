import * as saleRepository from '../repositories/sale.repository';
import { ISaleRequest, ISale } from '../interfaces/ISale';

export const registerTransactionalSale = async (saleData: ISaleRequest, user_id: number): Promise<ISale> => {
    return saleRepository.registerTransactionalSale(saleData, user_id);
};

export const findSaleById = async (id: number): Promise<any | undefined> => {
    const sale = await saleRepository.findSaleById(id);
    return sale;
};