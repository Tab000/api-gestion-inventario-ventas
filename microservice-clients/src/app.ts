import express from 'express';
import bodyParser from 'body-parser';
import './config/db.config'; 
import clientRoutes from './routes/client.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use('/clients', clientRoutes);

app.get('/', (req, res) => {
    res.send('Microservicio de Clientes funcionando.');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'clients' });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Clientes escuchando en http://localhost:${PORT}`);
});

