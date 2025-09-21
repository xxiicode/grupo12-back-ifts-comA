import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import methodOverride from 'method-override';
import eventosRoutes from './routes/eventosRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para simular PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Rutas
app.use('/eventos', eventosRoutes);
app.use('/clientes', clientesRoutes);

// Página de inicio
app.get('/', (req, res) => {
  res.render('index');
});


export default app;
