import { db } from '../config/db.config';
import { IProduct, IProductRequest } from '../interfaces/IProduct';
import sqlite3 from 'sqlite3';

const findProductById = (id: number): Promise<IProduct | undefined> => {
    return new Promise((resolve, reject) => {
        db.get('SELECT *, datetime(created_at) as created_at_iso FROM products WHERE id = ?', [id], (err, row: IProduct) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

export const create = (productData: IProductRequest): Promise<IProduct> => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO products (code_sku, name, category, price_unit, cost_unit, stock_actual, stock_minimo, location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
        db.run(sql, [
            productData.code_sku,
            productData.name,
            productData.category,
            productData.price_unit,
            productData.cost_unit,
            productData.stock_actual,
            productData.stock_minimo,
            productData.location
        ], function(this: sqlite3.RunResult, err) {
            if (err) return reject(err);

            const created_at_iso = new Date().toISOString(); 

            const newProduct: IProduct = { 
                id: this.lastID, 

                code_sku: productData.code_sku,
                name: productData.name,
                category: productData.category,
                price_unit: productData.price_unit,
                cost_unit: productData.cost_unit,
                stock_actual: productData.stock_actual,
                stock_minimo: productData.stock_minimo,
                location: productData.location,

                alert_stock: productData.stock_actual <= productData.stock_minimo, 
                created_at: created_at_iso 
            };

            resolve(newProduct);
        });
    });
};

export const findAll = (): Promise<IProduct[]> => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows: IProduct[]) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

export { findProductById as findById };