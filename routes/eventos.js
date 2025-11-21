import express from 'express';
import * as ctrl from '../controllers/eventosController.js';
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles, autorizarInvitados, autorizarPresupuesto } from "../middlewares/rolMiddleware.js";
import Evento from "../models/Evento.js";

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

// LISTAR eventos (filtro por rol en controller)
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
// mostrarFormularioEdicion permite:
// - admin / coordinador → editar
// - cliente y asistente → ver detalles en modo lectura
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

// admin / coordinador / asistente asignado
router.post(
  '/:id/invitados/agregar',
  verificarToken,
  autorizarInvitados(),
  ctrl.agregarInvitado
);

router.post(
  '/:id/invitados/:index/toggle',
  verificarToken,
  autorizarInvitados(),
  ctrl.toggleInvitadoEstado
);

router.delete(
  '/:id/invitados/:index',
  verificarToken,
  autorizarInvitados(),
  ctrl.eliminarInvitado
);

// -----------------------------------------
// PRESUPUESTO
// -----------------------------------------

router.get('/:id/presupuesto', verificarToken, ctrl.mostrarPresupuesto);

//  admin / coordinador / asistente asignado
router.post(
  '/:id/presupuesto/agregar',
  verificarToken,
  autorizarPresupuesto(),
  ctrl.agregarGasto
);

router.delete(
  '/:id/presupuesto/:index',
  verificarToken,
  autorizarPresupuesto(),
  ctrl.eliminarGasto
);

// -----------------------------------------
// CHAT
// -----------------------------------------
router.get('/chat/:id', verificarToken, ctrl.mostrarChatEvento);

//TESTING

router.post("/:id/presupuesto", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, monto } = req.body;

    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    evento.gastos.push({ descripcion: titulo, monto });
    await evento.save();

    return res.json(evento);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.post("/:id/invitados", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const evento = await Evento.findById(id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    evento.invitados.push({ nombre });
    await evento.save();

    return res.json(evento);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


export default router;
