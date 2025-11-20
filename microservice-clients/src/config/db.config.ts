import sqlite3 from 'sqlite3';

const dbPath = process.env.DB_PATH || './db-clients.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite de Clientes.');
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
    
    console.log('Estructura de la base de datos de Clientes verificada y lista.');
};

export { db };

