import { Request, Response } from 'express';
import * as clientService from '../services/client.service';
import { IClientRequest } from '../interfaces/IClient';

export const createClient = async (req: Request, res: Response) => {
    try {
        const clientData: IClientRequest = req.body;
        const newClient = await clientService.create(clientData);
        res.status(201).json(newClient);
    } catch (error) {
        if (error instanceof Error && error.message.includes('DUPLICATE_ENTRY')) {
            return res.status(409).json({ error: error.message.replace('DUPLICATE_ENTRY: ', '') });
        }
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error interno al crear el cliente.' });
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await clientService.findAll();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno al obtener los clientes.' });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const client = await clientService.findById(id);
        if (!client) {
            return res.status(404).json({ error: `Cliente con ID ${id} no encontrado.` });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(500).json({ error: 'Error interno al obtener el cliente.' });
    }
};