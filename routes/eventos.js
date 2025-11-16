import express from 'express';
import * as ctrl from '../controllers/eventosController.js';
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

// RUTAS API
router.get('/api', ctrl.getAllEventos);
router.get('/api/:id', ctrl.getEventoById);
router.post('/api', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.createEvento);
router.put('/api/:id', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.updateEvento);
router.delete('/api/:id', verificarToken, autorizarRoles("admin"), ctrl.removeEvento); // Solo admin elimina vía API

router.get('/api/:id/full', ctrl.getEventoWithCliente);

// RUTAS WEB (VISTAS PUG)
router.get('/', verificarToken, ctrl.listarEventos);

// Crear nuevo evento desde formulario web (solo admin y coordinador)
router.post('/', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.crearEventoWeb);

// Mostrar formulario de edición (solo admin y coordinador)
router.get('/editar/:id', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.mostrarFormularioEdicion);

// Guardar cambios desde formulario (solo admin y coordinador)
router.post('/editar/:id', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.guardarEdicionWeb);

// Mostrar chat del evento
router.get('/chat/:id', verificarToken, ctrl.mostrarChatEvento);

export default router;
