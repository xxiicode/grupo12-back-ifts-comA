import express from 'express';
import * as ctrl from '../controllers/eventosController.js';

const router = express.Router();

// ---------- RUTAS API (JSON) ----------
router.get('/api', ctrl.getEventos());
router.get('/api/:id', ctrl.getEvento());
router.post('/api', ctrl.createEvento());
router.put('/api/:id', ctrl.updateEvento());
router.delete('/api/:id', ctrl.deleteEvento());
router.get('/api/:id/full', ctrl.getEventoFull());

// ---------- RUTAS WEB (VISTAS PUG) ----------
router.get('/', ctrl.showEventos());
router.post('/', ctrl.createEventoWeb());
router.get('/editar/:id', ctrl.showEditForm());
router.post('/editar/:id', ctrl.updateEventoWeb());

export default router;
