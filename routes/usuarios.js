import express from "express";
import {
  listarClientes,
  mostrarFormularioEdicion,
  guardarEdicion,
  eliminarCliente
} from "../controllers/usuariosController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";
import { registrarCliente } from "../controllers/usuariosController.js";

const router = express.Router();

// Solo admin y coordinador pueden gestionar clientes
router.use(verificarToken, autorizarRoles("admin", "coordinador"));

// Listar todos los clientes (usuarios con rol cliente)
router.get("/clientes", listarClientes);

// Formulario de edición
router.get("/editar/:id", mostrarFormularioEdicion);

// Guardar cambios
router.post("/editar/:id", guardarEdicion);

// Eliminar cliente (AJAX)
router.delete("/api/:id", eliminarCliente);

// Registrar cliente
router.post("/clientes/crear", registrarCliente);

export default router;
