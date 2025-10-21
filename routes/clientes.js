import express from 'express';
import * as ctrl from '../controllers/clientesController.js';

const router = express.Router();

// ---------- RUTAS API (JSON) ----------

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

// ---------- RUTAS WEB (VISTAS PUG) ----------

// Listar todos los clientes
router.get('/', ctrl.listarClientes);

// Crear nuevo cliente desde formulario web
router.post('/', ctrl.crearClienteWeb);

export default router;
