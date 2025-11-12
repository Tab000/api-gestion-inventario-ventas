import * as clientRepository from '../repositories/client.repository';
import { IClient, IClientRequest } from '../interfaces/IClient';

export const create = async (clientData: IClientRequest): Promise<IClient> => {
    return clientRepository.create(clientData);
};

export const findAll = async (): Promise<IClient[]> => {
    return clientRepository.findAll();
};

export const findById = async (id: number): Promise<IClient | undefined> => {
    return clientRepository.findById(id);
};