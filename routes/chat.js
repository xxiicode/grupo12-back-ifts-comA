import express from "express";
import Mensaje from "../models/Mensaje.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verChat } from "../controllers/chatController.js";

const router = express.Router();

// ==============================
// VISTA DEL CHAT (por evento)
// ==============================
router.get("/:eventoId", verificarToken, verChat);

// ==============================
// API: Obtener historial de mensajes
// ==============================
router.get("/historial/:eventoId", async (req, res) => {
  try {
    const { eventoId } = req.params;
    const mensajes = await Mensaje.find({ eventoId })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
