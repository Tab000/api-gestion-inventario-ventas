import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite.');
        db.run('PRAGMA foreign_keys = ON;');
        initializeDb();
    }
});

const initializeDb = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            document TEXT UNIQUE NOT NULL, 
            address TEXT,
            phone TEXT,
            email TEXT UNIQUE NOT NULL,
            observations TEXT,
            created_at DATETIME NOT NULL
        );
    `);

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

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            sale_date DATETIME NOT NULL,
            total REAL NOT NULL,
            user_id INTEGER NOT NULL, -- ASR-AUDIT: Usuario que realizó la acción
            created_at DATETIME NOT NULL,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sale_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `);
    
    console.log('Estructura de la base de datos verificada y lista.');
};

export { db };