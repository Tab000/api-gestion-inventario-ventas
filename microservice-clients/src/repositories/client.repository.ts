import { db } from '../config/db.config';
import { IClient, IClientRequest } from '../interfaces/IClient';
import sqlite3 from 'sqlite3';

const findClientById = (id: number): Promise<IClient | undefined> => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row: IClient) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

export const create = (clientData: IClientRequest): Promise<IClient> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO clients (name, document, address, phone, email, observations, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`;
        db.run(sql, [
            clientData.name,
            clientData.document,
            clientData.address,
            clientData.phone,
            clientData.email,
            clientData.observations
        ], function(this: sqlite3.RunResult, err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return reject(new Error('DUPLICATE_ENTRY: El documento o email ya están registrados.'));
                }
                return reject(err);
            }
            
            const created_at_iso = new Date().toISOString(); 
            const newClient: IClient = { 
                id: this.lastID, 
                ...clientData, 
                created_at: created_at_iso 
            };

            resolve(newClient);
        });
    });
};

export const findAll = (): Promise<IClient[]> => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM clients', [], (err, rows: IClient[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

export { findClientById as findById };

