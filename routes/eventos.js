const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventosController');
const clientesCtrl = require('../controllers/clientesController');
const Evento = require('../models/Evento');

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
  if (!nombre || !fecha || !clienteId) {
    return res.status(400).json({ error: 'Nombre, fecha y clienteId son obligatorios' });
  }
  const nuevo = await ctrl.create(
    new Evento(null, nombre, fecha, lugar, presupuesto, estado, clienteId)
  );
  res.status(201).json(nuevo);
});

// Actualizar evento
router.put('/api/:id', async (req, res) => {
  const data = { ...req.body };
  if (data.presupuesto) data.presupuesto = Number(data.presupuesto);
  if (data.clienteId) data.clienteId = Number(data.clienteId);
  const actualizado = await ctrl.update(req.params.id, data);
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
  const eventos = await ctrl.getAll();
  const clientes = await clientesCtrl.getAll();

  // Expandir los eventos con el nombre del cliente
  const eventosConCliente = eventos.map(e => {
    const cliente = clientes.find(c => c.id == e.clienteId);
    return { ...e, cliente };
  });

  res.render('eventos', { eventos: eventosConCliente, clientes });
});

// Crear nuevo evento desde formulario web
router.post('/', async (req, res) => {
  const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
  await ctrl.create(new Evento(null, nombre, fecha, lugar, presupuesto, estado, clienteId));
  res.redirect('/eventos');
});

// ---------- EDICIÓN ----------

// Mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
  const evento = await ctrl.getById(req.params.id);
  if (!evento) return res.status(404).send("Evento no encontrado");

  const clientes = await clientesCtrl.getAll();
  res.render('editarEvento', { evento, clientes });
});

// Guardar cambios desde formulario
router.post('/editar/:id', async (req, res) => {
  const data = { ...req.body };
  if (data.presupuesto) data.presupuesto = Number(data.presupuesto);
  if (data.clienteId) data.clienteId = Number(data.clienteId);
  await ctrl.update(req.params.id, data);
  res.redirect('/eventos');
});

// ---------- evento + cliente (API especial) ----------
router.get('/api/:id/full', async (req, res) => {
  const evento = await ctrl.getByIdWithCliente(req.params.id);
  if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
  res.json(evento);
});

module.exports = router;
