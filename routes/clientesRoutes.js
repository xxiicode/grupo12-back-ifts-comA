import express from 'express';
import * as ctrl from '../controllers/clientesController.js';

const router = express.Router();

// ---------- API (JSON) ----------
router.get('/api', ctrl.getClientes());
router.get('/api/:id', ctrl.getCliente());
router.post('/api', ctrl.createCliente());
router.put('/api/:id', ctrl.updateCliente());
router.delete('/api/:id', ctrl.deleteCliente());

export default router;
