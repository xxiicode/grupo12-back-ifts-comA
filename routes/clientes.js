const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clientesController');
const Cliente = require('../models/Cliente');

// ---------- API (JSON) ----------

// Listar todos
router.get('/api', async (req, res) => {
  const clientes = await ctrl.getAll();
  res.json(clientes);
});

// Buscar por ID
router.get('/api/:id', async (req, res) => {
  const cliente = await ctrl.getById(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

// Crear nuevo
router.post('/api', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }
  const nuevo = await ctrl.create(new Cliente(null, nombre, email, telefono));
  res.status(201).json(nuevo);
});

// Actualizar
router.put('/api/:id', async (req, res) => {
  const actualizado = await ctrl.update(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(actualizado);
});

// Eliminar
router.delete('/api/:id', async (req, res) => {
  const eliminado = await ctrl.remove(req.params.id);
  if (!eliminado) return res.status(400).json({ error: 'No se pudo eliminar (cliente no existe o tiene eventos activos)' });
  res.json({ ok: true });
});

module.exports = router;
