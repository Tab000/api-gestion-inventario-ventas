import { db } from '../config/db.config';
import { ISaleRequest, ISaleHeader, ISaleDetail, ISaleResponse } from '../interfaces/ISale';
import sqlite3 from 'sqlite3';

const createSaleHeader = (client_id: number, total: number, userId: number, dbInstance: sqlite3.Database): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO sales (client_id, total, user_id, sale_date, created_at) 
            VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;
        
        dbInstance.run(sql, [client_id, total, userId], function(this: sqlite3.RunResult, err) {
            if (err) {
                console.error("Error en createSaleHeader:", err);
                return reject(new Error(`Failed to insert sale header: ${err.message}`));
            }
            resolve(this.lastID);
        });
    });
};

export const create = (saleData: ISaleRequest, products: Array<{product: any, quantity: number}>, userId: number): Promise<ISaleHeader & { details: ISaleDetail[] }> => {
    return new Promise(async (resolve, reject) => {
        db.run('BEGIN TRANSACTION;', async (err) => {
            if (err) return reject(new Error('Failed to begin transaction.'));

            try {
                let totalSale = 0;
                const insertedDetails: ISaleDetail[] = [];

                // Calcular el total
                for (const item of products) {
                    totalSale += item.product.price_unit * item.quantity;
                }

                const saleId = await createSaleHeader(saleData.client_id, totalSale, userId, db);

                // Crear detalles y actualizar stock en el servicio de productos
                for (const item of products) {
                    const subtotal = item.product.price_unit * item.quantity;

                    const detailId = await new Promise<number>((res, rej) => {
                        const detailSql = `INSERT INTO sale_details (sale_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;
                        db.run(detailSql, [saleId, item.product.id, item.quantity, subtotal], function(this: sqlite3.RunResult, err) {
                            if (err) {
                                console.error(`Error al insertar detalle de venta para producto ${item.product.id}:`, err);
                                return rej(err);
                            }
                            res(this.lastID);
                        });
                    });

                    insertedDetails.push({ 
                        id: detailId,
                        sale_id: saleId,
                        product_id: item.product.id, 
                        quantity: item.quantity, 
                        subtotal: subtotal
                    });
                }

                db.run('COMMIT;', (err) => {
                    if (err) {
                        console.error("Error al commitear:", err);
                        throw new Error(`Failed to commit transaction: ${err.message}`);
                    }
                    
                    db.get('SELECT id, client_id, total, user_id, sale_date, created_at FROM sales WHERE id = ?', [saleId], (err, header: ISaleHeader) => {
                        if (err || !header) {
                            console.warn("No se pudo recuperar la cabecera final. Devolviendo datos parciales.");
                            resolve({ 
                                id: saleId, 
                                client_id: saleData.client_id, 
                                total: totalSale, 
                                user_id: userId,
                                sale_date: new Date().toISOString(),
                                created_at: new Date().toISOString(),
                                details: insertedDetails 
                            });
                        } else {
                            resolve({ ...header, details: insertedDetails });
                        }
                    });
                });

            } catch (error) {
                db.run('ROLLBACK;', () => {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown transaction error.';
                    console.error("Transacción revertida debido a error:", errorMessage);
                    
                    reject({ 
                        error: errorMessage, 
                        transaction_status: "ROLLBACK" 
                    });
                });
            }
        });
    });
};

export const findAll = (): Promise<ISaleHeader[]> => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM sales', [], (err, rows: ISaleHeader[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

export const findById = (id: number): Promise<ISaleResponse | undefined> => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM sales WHERE id = ?', [id], (err, header: ISaleHeader) => {
            if (err) return reject(err);
            if (!header) return resolve(undefined);

            db.all('SELECT * FROM sale_details WHERE sale_id = ?', [id], (err, details: ISaleDetail[]) => {
                if (err) return reject(err);

                const saleResponse: ISaleResponse = {
                    ...header,
                    details: details || []
                };
                
                resolve(saleResponse);
            });
        });
    });
};

