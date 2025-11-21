import express from "express";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

// Todas estas rutas son EXCLUSIVAS del rol admin
router.use(verificarToken, autorizarRoles("admin"));

// ===============================
// LISTAR TODOS LOS USUARIOS
// ===============================
router.get("/", async (req, res) => {
  const usuarios = await Usuario.find().lean();
  res.render("usuarios", { usuarios });
});

// ===============================
// MOSTRAR FORMULARIO DE EDICIÓN
// ===============================
router.get("/editar/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).lean();
  if (!usuario) return res.status(404).send("Usuario no encontrado");
  res.render("editarUsuario", { usuario });
});

// ===============================
// GUARDAR EDICIÓN
// ===============================
router.post("/editar/:id", async (req, res) => {
  const { username, nombre, dni, email, telefono, rol, password } = req.body;
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) return res.status(404).send("Usuario no encontrado");

  usuario.username = username;
  usuario.nombre = nombre;
  usuario.dni = dni;
  usuario.email = email;
  usuario.telefono = telefono;
  usuario.rol = rol;

  if (password && password.trim() !== "") {
    usuario.passwordHash = await bcrypt.hash(password, 10);
  }

  await usuario.save();
  res.redirect("/usuarios/admin");
});

// ===============================
// ELIMINAR USUARIO
// ===============================
router.delete("/api/:id", async (req, res) => {
  const eliminado = await Usuario.findByIdAndDelete(req.params.id);
  if (!eliminado) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ ok: true });
});

// ===============================
// API: LISTAR TODOS LOS USUARIOS
// ===============================
router.get("/api", async (req, res) => {
  try {
    const usuarios = await Usuario.find().lean();
    res.json({ ok: true, usuarios });
  } catch (err) {
    console.error("Error en usuarios/admin/api:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ===============================
// API: OBTENER USUARIO POR ID
// ===============================
router.get("/api/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).lean();
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ ok: true, usuario });
  } catch (err) {
    console.error("Error en usuarios/admin/api/:id:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;
