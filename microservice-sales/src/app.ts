import express from 'express';
import bodyParser from 'body-parser';
import './config/db.config'; 
import saleRoutes from './routes/sale.routes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());

app.use('/sales', saleRoutes);

app.get('/', (req, res) => {
    res.send('Microservicio de Ventas funcionando.');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'sales' });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Ventas escuchando en http://localhost:${PORT}`);
});

