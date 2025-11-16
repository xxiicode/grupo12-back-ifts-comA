import express from "express";
import {
  listarClientes,
  mostrarFormularioEdicion,
  guardarEdicion,
  eliminarCliente,
  registrarCliente
} from "../controllers/usuariosController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

// Ejecutar verificarToken siempre (para tener req.user)
router.use(verificarToken);

// LISTAR clientes => admin, coordinador, asistente (todos pueden ver lista, aunque asistentes tienen vista limitada)
router.get("/clientes", (req, res, next) => {
  if (["admin", "coordinador", "asistente"].includes(req.user.rol)) return next();
  return res.status(403).send("Acceso denegado");
}, listarClientes);

// Registrar nuevo cliente (formulario en /usuarios/clientes) -> solo admin y coordinador
router.post("/clientes/crear", autorizarRoles("admin", "coordinador"), registrarCliente);

// Formulario de edición -> admin y coordinador
router.get("/editar/:id", autorizarRoles("admin", "coordinador"), mostrarFormularioEdicion);
router.post("/editar/:id", autorizarRoles("admin", "coordinador"), guardarEdicion);

// Eliminar cliente (AJAX) -> solo admin y coordinador
router.delete("/api/:id", autorizarRoles("admin", "coordinador"), eliminarCliente);

export default router;
