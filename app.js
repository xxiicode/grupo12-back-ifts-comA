import express from 'express';
import clientesRoutes from './routes/clientesRoutes.js';
import eventosRoutes from './routes/eventosRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola Mundo Cruel desde Node.js y Express!');
});

app.use('/clientes', clientesRoutes);
app.use('/eventos', eventosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});