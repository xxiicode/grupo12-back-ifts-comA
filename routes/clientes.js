const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clientesController');

// ---------- API (JSON) ----------

// Listar todos
router.get('/api', ctrl.getAllClientes);

// Buscar por ID
router.get('/api/:id', ctrl.getClienteById);

// Crear nuevo
router.post('/api', ctrl.createCliente);

// Actualizar
router.put('/api/:id', ctrl.updateCliente);

// Eliminar
router.delete('/api/:id', ctrl.removeCliente);

module.exports = router;
