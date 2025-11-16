import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js";
import * as eventosService from "../services/eventosService.js";

// ==========================================
// ============= API CONTROLLERS ============
// ==========================================

async function getAllEventos(req, res) {
  try {
    const eventos = await eventosService.obtenerTodos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos", detalle: error.message });
  }
}

async function getEventoById(req, res) {
  try {
    const evento = await eventosService.buscarPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar evento", detalle: error.message });
  }
}

async function createEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para crear eventos" });
    }

    const {
      nombre, fecha, lugar, presupuesto,
      estado, clienteId, coordinadorId, asistentesIds
    } = req.body;

    if (!nombre || !fecha || !clienteId || !coordinadorId || !asistentesIds) {
      return res.status(400).json({
        error: "Faltan datos obligatorios: nombre, fecha, clienteId, coordinadorId, asistentesIds"
      });
    }

    // Convertir asistentesIds
    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : (typeof asistentesIds === "string" ? asistentesIds.split(",") : []);

    asistentesArr = asistentesArr.filter(Boolean);

    if (asistentesArr.length < 1 || asistentesArr.length > 10) {
      return res.status(400).json({ error: "Debe asignarse entre 1 y 10 asistentes." });
    }

    // Validar roles
    const coord = await Usuario.findById(coordinadorId);
    if (!coord || coord.rol !== "coordinador") {
      return res.status(400).json({ error: "El coordinadorId no es válido." });
    }

    const asistentesDocs = await Usuario.find({ _id: { $in: asistentesArr }});
    if (asistentesDocs.length !== asistentesArr.length || asistentesDocs.some(a => a.rol !== "asistente")) {
      return res.status(400).json({ error: "Los asistentes seleccionados no son válidos." });
    }

    const cliente = await Usuario.findById(clienteId);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(400).json({ error: "El cliente seleccionado no es válido." });
    }

    const nuevoEvento = await eventosService.crear({
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds: asistentesArr
    });

    res.status(201).json(nuevoEvento);

  } catch (error) {
    res.status(500).json({ error: "Error al crear evento", detalle: error.message });
  }
}

async function updateEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para editar eventos" });
    }

    const actualizado = await eventosService.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: "Evento no encontrado" });

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar evento", detalle: error.message });
  }
}

async function removeEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;

    if (usuario.rol !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para eliminar eventos" });
    }

    const eliminado = await eventosService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Evento no encontrado" });

    res.json({ ok: true, mensaje: "Evento eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar evento", detalle: error.message });
  }
}

async function getEventoWithCliente(req, res) {
  try {
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener evento completo", detalle: error.message });
  }
}

// ==========================================
// ============== WEB CONTROLLERS ===========
// ==========================================

async function listarEventos(req, res) {
  try {
    const usuario = res.locals.user;
    let filtros = {};

    // Filtrado por rol
    if (usuario.rol === "cliente") {
      filtros.clienteId = usuario._id;
    } else if (usuario.rol === "coordinador") {
      filtros.coordinadorId = usuario._id;
    } else if (usuario.rol === "asistente") {
      filtros.asistentesIds = usuario._id;
    }

    // Obtener eventos con populate
    let eventos = await Evento.find(filtros)
      .populate("clienteId coordinadorId asistentesIds", "nombre username email rol")
      .lean();

    // Formatear fechas
    eventos = eventos.map(e => ({
      ...e,
      id: e._id.toString(),
      fechaFormateada: e.fecha
        ? new Date(e.fecha).toLocaleDateString("es-AR")
        : "",
      cliente: e.clienteId || null
    }));

    // Listas para el form (solo admin y coordinador)
    const clientes =
      ["admin", "coordinador"].includes(usuario.rol)
        ? await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 })
        : [];

    const coordinadores =
      ["admin", "coordinador"].includes(usuario.rol)
        ? await Usuario.find({ rol: "coordinador" }).sort({ nombre: 1 })
        : [];

    const asistentes =
      ["admin", "coordinador"].includes(usuario.rol)
        ? await Usuario.find({ rol: "asistente" }).sort({ nombre: 1 })
        : [];

    res.render("eventos", {
      eventos,
      clientes,
      coordinadores,
      asistentes,
      user: usuario
    });

  } catch (error) {
    console.error("Error al cargar eventos:", error);
    res.status(500).send("Error al cargar eventos");
  }
}

async function crearEventoWeb(req, res) {
  try {
    const usuario = res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para crear eventos" });
    }

    const { nombre, fecha, lugar, presupuesto, estado, clienteId, coordinadorId, asistentesIds } = req.body;

    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : (typeof asistentesIds === "string" ? asistentesIds.split(",") : []);

    asistentesArr = asistentesArr.filter(Boolean);

    if (!nombre || !fecha || !clienteId || !coordinadorId || asistentesArr.length < 1) {
      return res.redirect("/eventos");
    }

    await eventosService.crear({
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds: asistentesArr
    });

    res.redirect("/eventos");

  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).send("Error al crear evento");
  }
}

async function mostrarFormularioEdicion(req, res) {
  try {
    const usuario = res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para editar eventos" });
    }

    const evento = await eventosService.buscarPorId(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    const coordinadores = await Usuario.find({ rol: "coordinador" }).sort({ nombre: 1 });
    const asistentes = await Usuario.find({ rol: "asistente" }).sort({ nombre: 1 });

    evento.fechaFormateada =
      evento.fecha ? new Date(evento.fecha).toISOString().split("T")[0] : "";

    res.render("editarEvento", { evento, clientes, coordinadores, asistentes });

  } catch (error) {
    console.error("Error al editar evento:", error);
    res.status(500).send("Error al cargar edición");
  }
}

async function guardarEdicionWeb(req, res) {
  try {
    const usuario = res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para editar eventos" });
    }

    const { nombre, fecha, lugar, presupuesto, estado, clienteId, coordinadorId, asistentesIds } = req.body;

    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : (typeof asistentesIds === "string" ? asistentesIds.split(",") : []);

    asistentesArr = asistentesArr.filter(Boolean);

    await eventosService.actualizar(req.params.id, {
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds: asistentesArr
    });

    res.redirect("/eventos");

  } catch (error) {
    console.error("Error al guardar edición:", error);
    res.status(500).send("Error al guardar cambios");
  }
}

async function mostrarChatEvento(req, res) {
  try {
    const usuario = res.locals.user;
    const evento = await eventosService.obtenerConCliente(req.params.id);

    if (!evento) return res.status(404).send("Evento no encontrado");

    const puedeAcceder =
      usuario.rol === "admin" ||
      usuario.rol === "coordinador" ||
      (usuario.rol === "asistente" && evento.asistentesIds?.includes(usuario._id)) ||
      (usuario.rol === "cliente" && evento.clienteId?.toString() === usuario._id.toString());

    if (!puedeAcceder) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para ver este chat" });
    }

    const fechaFormateada = evento.fecha
      ? new Date(evento.fecha).toISOString().split("T")[0]
      : "";

    res.render("chatEvento", {
      evento: { ...evento._doc, id: evento._id.toString(), fechaFormateada }
    });

  } catch (error) {
    console.error("Error al cargar chat:", error);
    res.status(500).send("Error al cargar chat");
  }
}

// ==========================================
// ============== EXPORTS FINAL =============
// ==========================================
export {
  getAllEventos,
  getEventoById,
  createEvento,
  updateEvento,
  removeEvento,
  getEventoWithCliente,
  listarEventos,
  crearEventoWeb,
  mostrarFormularioEdicion,
  guardarEdicionWeb,
  mostrarChatEvento,
};
