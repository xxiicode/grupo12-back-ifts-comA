import express from 'express';
import * as ctrl from '../controllers/eventosController.js';
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

// -----------------------------------------
// RUTAS API
// -----------------------------------------
router.get('/api', ctrl.getAllEventos);
router.get('/api/:id', ctrl.getEventoById);

router.post(
  '/api',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.createEvento
);

router.put(
  '/api/:id',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.updateEvento
);

router.delete(
  '/api/:id',
  verificarToken,
  autorizarRoles("admin"),
  ctrl.removeEvento
);

router.get('/api/:id/full', ctrl.getEventoWithCliente);

// -----------------------------------------
// RUTAS WEB (PUG)
// -----------------------------------------
router.get('/', verificarToken, ctrl.listarEventos);

// CREAR EVENTO (solo admin y coordinador)
router.get(
  '/crear',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.mostrarFormularioCreacion
);

router.post(
  '/crear',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.crearEventoWeb
);

// -----------------------------------------
// EDITAR / VER DETALLES
// -----------------------------------------
//
// El controller se encarga de permitir:
// - admin / coordinador → editar
// - cliente → solo lectura (si es su evento)
// - otros → 403
//
router.get(
  '/editar/:id',
  verificarToken,
  ctrl.mostrarFormularioEdicion
);

// Guardar cambios — solo admin / coordinador
router.post(
  '/editar/:id',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.guardarEdicionWeb
);

// -----------------------------------------
// INVITADOS
// -----------------------------------------
router.get('/:id/invitados', verificarToken, ctrl.mostrarInvitados);

router.post(
  '/:id/invitados/agregar',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.agregarInvitado
);

router.post(
  '/:id/invitados/:index/toggle',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.toggleInvitadoEstado
);

router.delete(
  '/:id/invitados/:index',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.eliminarInvitado
);

// -----------------------------------------
// PRESUPUESTO
// -----------------------------------------
router.get('/:id/presupuesto', verificarToken, ctrl.mostrarPresupuesto);

router.post(
  '/:id/presupuesto/agregar',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.agregarGasto
);

router.delete(
  '/:id/presupuesto/:index',
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  ctrl.eliminarGasto
);

// -----------------------------------------
// CHAT
// -----------------------------------------
router.get('/chat/:id', verificarToken, ctrl.mostrarChatEvento);

export default router;
