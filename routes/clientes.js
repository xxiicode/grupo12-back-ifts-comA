const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const clientesCtrl = require('../controllers/clientesController');
const eventosCtrl = require('../controllers/eventosController');

// ---------- RUTAS API CLIENTES ----------

router.get('/api', async (req, res) => {
  res.json(await clientesCtrl.getAll());
});

router.get('/api/:id', async (req, res) => {
  const cliente = await clientesCtrl.getById(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

router.post('/api', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  if (!nombre || !email) return res.status(400).json({ error: 'nombre y email son obligatorios' });
  const nuevo = await clientesCtrl.create(new Cliente(null, nombre, email, telefono));
  res.status(201).json(nuevo);
});

router.put('/api/:id', async (req, res) => {
  const actualizado = await clientesCtrl.update(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(actualizado);
});

router.delete('/api/:id', async (req, res) => {
  // Regla: impedir borrar si tiene eventos
  const eventos = await eventosCtrl.getAll();
  const tieneEventos = eventos.some(e => String(e.clienteId) === String(req.params.id));
  if (tieneEventos) return res.status(409).json({ error: 'Cliente tiene eventos asociados' });
  const eliminado = await clientesCtrl.remove(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(eliminado);
});

// ---------- RUTAS ANIDADAS CLIENTE → EVENTOS ----------

router.get('/api/:clienteId/eventos', async (req, res) => {
  const cliente = await clientesCtrl.getById(req.params.clienteId);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  const eventos = await eventosCtrl.getAll();
  res.json(eventos.filter(e => String(e.clienteId) === String(req.params.clienteId)));
});

router.post('/api/:clienteId/eventos', async (req, res) => {
  const cliente = await clientesCtrl.getById(req.params.clienteId);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  const { nombre, fecha, lugar, presupuesto, estado } = req.body;
  if (!nombre || !fecha) return res.status(400).json({ error: 'nombre y fecha son obligatorios' });
  const Evento = require('../models/Evento');
  const nuevo = await eventosCtrl.create(new Evento(null, nombre, fecha, lugar, presupuesto, estado, Number(req.params.clienteId)));
  res.status(201).json(nuevo);
});

module.exports = router;
 
// ---------- RUTAS WEB (VISTAS) ----------
router.get('/', async (req, res) => {
  const clientes = await clientesCtrl.getAll();
  res.render('clientes', { clientes });
});

router.post('/', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  if (!nombre || !email) return res.status(400).send('nombre y email son obligatorios');
  await clientesCtrl.create(new Cliente(null, nombre, email, telefono));
  res.redirect('/clientes');
});

// Ver eventos de un cliente (vista)
router.get('/:clienteId/eventos', async (req, res) => {
  const cliente = await clientesCtrl.getById(req.params.clienteId);
  if (!cliente) return res.status(404).send('Cliente no encontrado');
  const [todosEventos, todosClientes] = await Promise.all([
    eventosCtrl.getAll(),
    clientesCtrl.getAll()
  ]);
  const eventos = todosEventos.filter(e => String(e.clienteId) === String(cliente.id));
  const clienteById = Object.fromEntries(todosClientes.map(c => [String(c.id), c]));
  res.render('eventos', { eventos, clientes: todosClientes, clienteById, clienteSeleccionado: cliente });
});


