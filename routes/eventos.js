// routes/eventos.js
import express from "express";
import {
  listarEventos,
  crearEvento,
  editarEventoForm,
  actualizarEvento,
  eliminarEvento
} from "../controllers/eventosController.js";

const router = express.Router();

// ---------- RUTAS WEB (VISTAS PUG) ----------
router.get("/", listarEventos);
router.post("/", crearEvento);
router.get("/editar/:id", editarEventoForm);
router.post("/editar/:id", actualizarEvento);
router.post("/eliminar/:id", eliminarEvento);

// ---------- RUTAS API (para probar con Thunder Client o Postman) ----------

// Obtener todos los eventos (JSON)
router.get("/api", async (req, res, next) => {
  try {
    const eventos = await import("../models/Evento.js").then(m => m.default.find());
    res.json(eventos);
  } catch (err) {
    next(err);
  }
});

// Crear evento (JSON)
router.post("/api", async (req, res, next) => {
  try {
    const Evento = (await import("../models/Evento.js")).default;
    const nuevo = await Evento.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
});

// Eliminar evento (JSON)
router.delete("/api/:id", async (req, res, next) => {
  try {
    const Evento = (await import("../models/Evento.js")).default;
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
