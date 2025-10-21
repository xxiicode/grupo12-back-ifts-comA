import express from 'express';
import * as ctrl from '../controllers/eventosController.js';

const router = express.Router();

// ---------- RUTAS API (Thunder Client / JSON) ----------

// Obtener todos los eventos
router.get('/api', ctrl.getAllEventos);

// Obtener un evento por ID
router.get('/api/:id', ctrl.getEventoById);

// Crear nuevo evento
router.post('/api', ctrl.createEvento);

// Actualizar evento
router.put('/api/:id', ctrl.updateEvento);

// Eliminar evento
router.delete('/api/:id', ctrl.removeEvento);

// Evento + cliente (API especial)
router.get('/api/:id/full', ctrl.getEventoWithCliente);

// ---------- RUTAS WEB (VISTAS PUG) ----------

// Listar todos los eventos
router.get('/', ctrl.listarEventos);

// Crear nuevo evento desde formulario web
router.post('/', ctrl.crearEventoWeb);

// Mostrar formulario de edición
router.get('/editar/:id', ctrl.mostrarFormularioEdicion);

// Guardar cambios desde formulario
router.post('/editar/:id', ctrl.guardarEdicionWeb);

export default router;
