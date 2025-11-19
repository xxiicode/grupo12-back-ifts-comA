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

// Ejecutar verificarToken siempre
router.use(verificarToken);

// ===============================
// CLIENTES
// ===============================

// Listar clientes
router.get("/clientes",
  autorizarRoles("admin", "coordinador"),
  listarClientes
);

// Crear cliente
router.post("/clientes/crear",
  autorizarRoles("admin", "coordinador"),
  registrarCliente
);

// Editar cliente
router.get("/editar/:id",
  autorizarRoles("admin", "coordinador"),
  mostrarFormularioEdicion
);

router.post("/editar/:id",
  autorizarRoles("admin", "coordinador"),
  guardarEdicion
);

// Eliminar cliente
router.delete("/api/:id",
  autorizarRoles("admin", "coordinador"),
  eliminarCliente
);

export default router;
