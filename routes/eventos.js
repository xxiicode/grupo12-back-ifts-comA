const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventosController');
const Evento = require('../models/Evento');
const clientesCtrl = require('../controllers/clientesController');


// ---------- RUTAS API (Thunder Client / JSON) ----------

// Obtener todos los eventos
router.get('/api', async (req, res) => {
  const eventos = await ctrl.getAll();
  res.json(eventos);
});

// Obtener un evento por ID
router.get('/api/:id', async (req, res) => {
  const evento = await ctrl.getById(req.params.id);
  if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
  res.json(evento);
});

// Crear nuevo evento
router.post('/api', async (req, res) => {
  const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
  if (!nombre || !fecha) {
    return res.status(400).json({ error: 'Nombre y fecha son obligatorios' });
  }
  try {
    const nuevo = await ctrl.create(new Evento(null, nombre, fecha, lugar, presupuesto, estado, clienteId));
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Actualizar evento
router.put('/api/:id', async (req, res) => {
  const actualizado = await ctrl.update(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ error: 'Evento no encontrado' });
  res.json(actualizado);
});

// Eliminar evento
router.delete('/api/:id', async (req, res) => {
  const eliminado = await ctrl.remove(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Evento no encontrado' });
  res.json({ ok: true });
});


// ---------- RUTAS WEB (VISTAS PUG) ----------

// Listar todos los eventos
router.get('/', async (req, res) => {
  const [eventos, clientes] = await Promise.all([
    ctrl.getAll(),
    clientesCtrl.getAll()
  ]);
  const clienteById = Object.fromEntries(clientes.map(c => [String(c.id), c]));
  res.render('eventos', { eventos, clientes, clienteById });
});

// Crear nuevo evento desde formulario web
router.post('/', async (req, res) => {
  const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
  await ctrl.create(new Evento(null, nombre, fecha, lugar, presupuesto, estado, clienteId));
  res.redirect('/eventos');
});


module.exports = router;
