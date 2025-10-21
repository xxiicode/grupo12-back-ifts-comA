// routes/clientes.js
import express from "express";
import {
  listarClientes,
  crearCliente,
  editarClienteForm,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clientesController.js";

const router = express.Router();

// ---------- RUTAS WEB (VISTAS PUG) ----------
router.get("/", listarClientes);
router.post("/", crearCliente);
router.get("/editar/:id", editarClienteForm);
router.post("/editar/:id", actualizarCliente);
router.post("/eliminar/:id", eliminarCliente);

// ---------- RUTAS API (para Thunder Client / Postman) ----------

// Listar todos los clientes (JSON)
router.get("/api", async (req, res, next) => {
  try {
    const Cliente = (await import("../models/Cliente.js")).default;
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
});

// Crear nuevo cliente (JSON)
router.post("/api", async (req, res, next) => {
  try {
    const Cliente = (await import("../models/Cliente.js")).default;
    const nuevo = await Cliente.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
});

// Eliminar cliente (JSON)
router.delete("/api/:id", async (req, res, next) => {
  try {
    const Cliente = (await import("../models/Cliente.js")).default;
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
