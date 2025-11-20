import sqlite3 from 'sqlite3';

const dbPath = process.env.DB_PATH || './db-sales.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite de Ventas.');
        db.run('PRAGMA foreign_keys = ON;');
        initializeDb();
    }
});

const initializeDb = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            sale_date DATETIME NOT NULL,
            total REAL NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sale_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales(id)
        );
    `);
    
    console.log('Estructura de la base de datos de Ventas verificada y lista.');
};

export { db };

