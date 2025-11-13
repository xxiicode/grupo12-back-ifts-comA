import Evento from "../models/Evento.js";
import * as eventosService from "../services/eventosService.js";
import Usuario from "../models/Usuario.js";

// ==============================
// CONTROLADORES API
// ==============================

// Obtener todos los eventos (API)
async function getAllEventos(req, res) {
  try {
    const eventos = await eventosService.obtenerTodos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos", detalle: error.message });
  }
}

// Obtener un evento por ID (API)
async function getEventoById(req, res) {
  try {
    const evento = await eventosService.buscarPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar evento", detalle: error.message });
  }
}

// Crear nuevo evento (API)
async function createEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para crear eventos" });
    }

    const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
    if (!nombre || !fecha || !clienteId) {
      return res.status(400).json({ error: "Nombre, fecha y clienteId son obligatorios" });
    }

    const cliente = await Usuario.findById(clienteId);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(400).json({ error: "El clienteId no corresponde a un usuario válido con rol 'cliente'" });
    }

    const nuevoEvento = await eventosService.crear({
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: "Error al crear evento", detalle: error.message });
  }
}

// Actualizar evento (API)
async function updateEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para editar eventos" });
    }

    const actualizado = await eventosService.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar evento", detalle: error.message });
  }
}

// Eliminar evento (API)
async function removeEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar eventos" });
    }

    const eliminado = await eventosService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Evento no encontrado" });
    res.json({ ok: true, mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar evento", detalle: error.message });
  }
}

// Obtener evento con cliente incluido (API)
async function getEventoWithCliente(req, res) {
  try {
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener evento completo", detalle: error.message });
  }
}

// ==============================
// CONTROLADORES WEB (PUG)
// ==============================

// Listar eventos (Vista) con control por rol
async function listarEventos(req, res) {
  try {
    const usuario = res.locals.user; // viene del middleware verificarToken
    let eventosConCliente = [];

    if (["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      // Roles internos: ver todos los eventos
      eventosConCliente = await eventosService.obtenerTodosConClientes();
    } else if (usuario.rol === "cliente") {
      // Cliente: solo su evento asignado
      eventosConCliente = await Evento.find({ clienteId: usuario._id })
        .populate("clienteId", "nombre username email");
    } else {
      return res.status(403).render("error", { mensaje: "Acceso denegado" });
    }

    // Clientes disponibles para el <select> (solo si el usuario tiene permiso)
    const clientes =
      ["admin", "coordinador", "asistente"].includes(usuario.rol)
        ? await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 })
        : [];

    const eventosFormateados = eventosConCliente.map((e) => {
      const fecha = e.fecha ? new Date(e.fecha) : null;
      const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";
      return {
        ...e._doc,
        id: e._id.toString(),
        fechaFormateada,
        cliente: e.clienteId || null,
      };
    });

    res.render("eventos", { eventos: eventosFormateados, clientes });
  } catch (error) {
    console.error("Error al cargar eventos:", error);
    res.status(500).send("Error al cargar eventos");
  }
}

// Crear evento desde formulario web
async function crearEventoWeb(req, res) {
  try {
    const usuario = res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para crear eventos" });
    }

    const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
    await eventosService.crear({ nombre, fecha, lugar, presupuesto, estado, clienteId });
    res.redirect("/eventos");
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).send("Error al crear evento");
  }
}

// Mostrar formulario de edición
async function mostrarFormularioEdicion(req, res) {
  try {
    const usuario = res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para editar eventos" });
    }

    const evento = await eventosService.buscarPorId(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    evento.fechaFormateada = evento.fecha
      ? new Date(evento.fecha).toISOString().split("T")[0]
      : "";

    res.render("editarEvento", { evento, clientes });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición");
  }
}

// Guardar cambios desde formulario
async function guardarEdicionWeb(req, res) {
  try {
    const usuario = res.locals.user;
    if (!["admin", "coordinador", "asistente"].includes(usuario.rol)) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para editar eventos" });
    }

    await eventosService.actualizar(req.params.id, req.body);
    res.redirect("/eventos");
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    res.status(500).send("Error al guardar cambios");
  }
}

// Mostrar chat del evento con control de acceso
async function mostrarChatEvento(req, res) {
  try {
    const usuario = res.locals.user;
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const puedeAcceder =
      ["admin", "coordinador", "asistente"].includes(usuario.rol) ||
      (usuario.rol === "cliente" && evento.clienteId?._id.toString() === usuario._id.toString());

    if (!puedeAcceder) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para ver este chat" });
    }

    const fechaFormateada = evento.fecha
      ? new Date(evento.fecha).toISOString().split("T")[0]
      : "";

    res.render("chatEvento", {
      evento: { ...evento._doc, id: evento._id.toString(), fechaFormateada },
    });
  } catch (error) {
    console.error("Error al cargar chat:", error);
    res.status(500).send("Error al cargar chat");
  }
}

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
