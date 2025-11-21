import Evento from "../models/Evento.js";

// ===============================
// Controlador de Chat por Evento
// ===============================

export async function verChat(req, res) {
  try {
    const usuario = res.locals.user; // del middleware verificarToken
    const eventoId = req.params.eventoId;

    const evento = await Evento.findById(eventoId)
      .populate("clienteId", "nombre username email")
      .lean();

    if (!evento) {
      return res.status(404).render("error", { mensaje: "Evento no encontrado" });
    }

    //  Control de acceso: solo los involucrados pueden entrar
    const puedeEntrar =
      ["admin", "coordinador", "asistente"].includes(usuario.rol) ||
      (usuario.rol === "cliente" && evento.clienteId?._id.toString() === usuario._id.toString());

    if (!puedeEntrar) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para acceder al chat de este evento." });
    }

    // Renderizar chat
    res.render("chat", {
      evento,
      usuario, // útil para mostrar quién es en el chat
    });
  } catch (error) {
    console.error("Error al mostrar chat:", error);
    res.status(500).render("error", { mensaje: "Error interno al cargar el chat." });
  }
}
