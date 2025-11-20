import sqlite3 from 'sqlite3';

const dbPath = process.env.DB_PATH || './db-products.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite de Productos.');
        db.run('PRAGMA foreign_keys = ON;');
        initializeDb();
    }
});

const initializeDb = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code_sku TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            category TEXT,
            price_unit REAL NOT NULL,
            cost_unit REAL NOT NULL,
            stock_actual INTEGER NOT NULL,
            stock_minimo INTEGER NOT NULL,
            location TEXT,
            created_at DATETIME NOT NULL
        );
    `);
    
    console.log('Estructura de la base de datos de Productos verificada y lista.');
};

export { db };

