const express = require('express');
const path = require('path');
const app = express();

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const eventosRoutes = require('./routes/eventos');
app.use('/eventos', eventosRoutes);

// Página de inicio
app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
