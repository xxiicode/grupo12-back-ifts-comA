import express from "express";
import Usuario from "../models/Usuario.js";
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

// ==============================================
// LISTAR clientes => SOLO admin y coordinador
// ==============================================
router.get("/clientes", (req, res, next) => {
  if (["admin", "coordinador"].includes(req.user.rol)) return next();
  return res.status(403).send("Acceso denegado");
}, listarClientes);

// Registrar nuevo cliente -> solo admin y coordinador
router.post("/clientes/crear",
  autorizarRoles("admin", "coordinador"),
  registrarCliente
);

// Formulario de edición -> admin y coordinador
router.get("/editar/:id",
  autorizarRoles("admin", "coordinador"),
  mostrarFormularioEdicion
);

router.post("/editar/:id",
  autorizarRoles("admin", "coordinador"),
  guardarEdicion
);

// Eliminar cliente (AJAX) -> solo admin y coordinador
router.delete("/api/:id",
  autorizarRoles("admin", "coordinador"),
  eliminarCliente
);

// =======================================
// API: LISTAR USUARIOS (admin, coordinador)
// =======================================
router.get("/api",
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  async (req, res) => {
    try {
      const usuarios = await Usuario.find().lean();
      res.json({ ok: true, usuarios });
    } catch (err) {
      console.error("Error en usuarios/api:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.get("/api/:id",
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.params.id).lean();
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ ok: true, usuario });
    } catch (err) {
      console.error("Error en usuarios/api/:id:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;
