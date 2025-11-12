import express from 'express';
import bodyParser from 'body-parser';
import './config/db.config'; 
import clientRoutes from './routes/client.routes';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/clients', clientRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);

app.get('/', (req, res) => {
    res.send('API de Gestión de Inventario/Ventas funcionando.');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});