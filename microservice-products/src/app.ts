import express from 'express';
import bodyParser from 'body-parser';
import './config/db.config'; 
import productRoutes from './routes/product.routes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Microservicio de Productos/Inventario funcionando.');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'products' });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Productos/Inventario escuchando en http://localhost:${PORT}`);
});

