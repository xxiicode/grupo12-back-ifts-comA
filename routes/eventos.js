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

// NUEVA RUTA: CREAR EVENTO (vista separada)
router.get('/crear', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.mostrarFormularioCreacion);
router.post('/crear', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.crearEventoWeb);

// Mostrar formulario de edición (solo admin y coordinador)
router.get('/editar/:id', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.mostrarFormularioEdicion);

// Guardar cambios desde formulario (solo admin y coordinador)
router.post('/editar/:id', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.guardarEdicionWeb);

// Invitados
router.get('/:id/invitados', verificarToken, ctrl.mostrarInvitados);
router.post('/:id/invitados/agregar', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.agregarInvitado);
router.post('/:id/invitados/:index/toggle', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.toggleInvitadoEstado);
router.delete('/:id/invitados/:index', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.eliminarInvitado);

// Presupuesto / gastos
router.get('/:id/presupuesto', verificarToken, ctrl.mostrarPresupuesto);
router.post('/:id/presupuesto/agregar', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.agregarGasto);
router.delete('/:id/presupuesto/:index', verificarToken, autorizarRoles("admin", "coordinador"), ctrl.eliminarGasto);

// Mostrar chat del evento
router.get('/chat/:id', verificarToken, ctrl.mostrarChatEvento);

export default router;
