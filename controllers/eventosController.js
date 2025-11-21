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
    res
      .status(500)
      .json({ error: "Error al obtener eventos", detalle: error.message });
  }
}

async function getEventoById(req, res) {
  try {
    const evento = await eventosService.buscarPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al buscar evento", detalle: error.message });
  }
}

async function createEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para crear eventos" });
    }

    let {
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds,
      descripcion,
    } = req.body;

    //  El COORDINADOR no PUEDE CAMBIAR coordinadorId

    if (usuario.rol === "coordinador") {
      coordinadorId = usuario._id;
    }

    if (!nombre || !fecha || !clienteId || !coordinadorId) {
      return res.status(400).json({
        error: "Faltan datos obligatorios: nombre, fecha, clienteId, coordinadorId",
      });
    }

    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : typeof asistentesIds === "string"
      ? asistentesIds.split(",")
      : [];

    asistentesArr = asistentesArr.filter(Boolean);

    if (asistentesArr.length < 1 || asistentesArr.length > 10) {
      return res.status(400).json({ error: "Debe asignarse entre 1 y 10 asistentes." });
    }

    // Validar roles
    const coord = await Usuario.findById(coordinadorId);
    if (!coord || coord.rol !== "coordinador") {
      return res.status(400).json({ error: "El coordinadorId no es válido." });
    }

    const asistentesDocs = await Usuario.find({ _id: { $in: asistentesArr } });
    if (
      asistentesDocs.length !== asistentesArr.length ||
      asistentesDocs.some((a) => a.rol !== "asistente")
    ) {
      return res
        .status(400)
        .json({ error: "Los asistentes seleccionados no son válidos." });
    }

    const cliente = await Usuario.findById(clienteId);
    if (!cliente || cliente.rol !== "cliente") {
      return res
        .status(400)
        .json({ error: "El cliente seleccionado no es válido." });
    }
    const nuevoEvento = await eventosService.crear({
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      descripcion,
      clienteId,
      coordinadorId,   
      asistentesIds: asistentesArr,
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

    let datosActualizados = { ...req.body };

    // COORDINADOR NO PUEDE CAMBIAR coordinadorId
    if (usuario.rol === "coordinador") {
      datosActualizados.coordinadorId = usuario._id;
    }

    const actualizado = await eventosService.actualizar(
      req.params.id,
      datosActualizados
    );

    if (!actualizado)
      return res.status(404).json({ error: "Evento no encontrado" });

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar evento",
      detalle: error.message,
    });
  }
}


async function removeEvento(req, res) {
  try {
    const usuario = req.user || res.locals.user;

    if (usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar eventos" });
    }

    const eliminado = await eventosService.eliminar(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Evento no encontrado" });

    res.json({ ok: true, mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar evento", detalle: error.message });
  }
}

async function getEventoWithCliente(req, res) {
  try {
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    res.json(evento);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener evento completo",
        detalle: error.message,
      });
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
      .populate(
        "clienteId coordinadorId asistentesIds",
        "nombre username email rol"
      )
      .sort({ fecha: 1 })
      .lean();

    // Formatear fechas
    eventos = eventos.map((e) => ({
      ...e,
      id: e._id.toString(),

      // Mostrar en pantalla (dd/mm/yyyy)
      fechaFormateada: e.fecha
        ? new Date(e.fecha).toLocaleDateString("es-AR")
        : "",

      // Para ordenar correctamente (ISO)
      fechaISO: e.fecha ? new Date(e.fecha).toISOString() : "",

      cliente: e.clienteId || null,
    }));

    // Listas para el form (solo admin y coordinador)
    const clientes = ["admin", "coordinador"].includes(usuario.rol)
      ? await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 })
      : [];

    const coordinadores = ["admin", "coordinador"].includes(usuario.rol)
      ? await Usuario.find({ rol: "coordinador" }).sort({ nombre: 1 })
      : [];

    const asistentes = ["admin", "coordinador"].includes(usuario.rol)
      ? await Usuario.find({ rol: "asistente" }).sort({ nombre: 1 })
      : [];

    res.render("eventos", {
      eventos,
      clientes,
      coordinadores,
      asistentes,
      user: usuario,
    });
  } catch (error) {
    console.error("Error al cargar eventos:", error);
    res.status(500).send("Error al cargar eventos");
  }
}

// Mostrar formulario para crear evento (vista separada)
async function mostrarFormularioCreacion(req, res) {
  try {
    const usuario = res.locals.user;

    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    const coordinadores = await Usuario.find({ rol: "coordinador" }).sort({
      nombre: 1,
    });
    const asistentes = await Usuario.find({ rol: "asistente" }).sort({
      nombre: 1,
    });

    res.render("crearEvento", {
      clientes,
      coordinadores,
      asistentes,
      user: usuario,
    });
  } catch (error) {
    console.error("Error al mostrar formulario de creación:", error);
    res.status(500).send("Error al cargar formulario");
  }
}


// Crear evento desde formulario web (ruta POST /eventos/crear)
async function crearEventoWeb(req, res) {
  try {
    const usuario = res.locals.user;

    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res
        .status(403)
        .render("error", { mensaje: "No tienes permiso para crear eventos" });
    }

    let {
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds,
      descripcion,
    } = req.body;

    // SI ES COORDINADOR → NO PUEDE CAMBIAR coordinadorId
     if (usuario.rol === "coordinador") {
      coordinadorId = usuario._id;
    }

    // Normalizar asistentes (acepta string con comas o array)
    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : typeof asistentesIds === "string"
      ? asistentesIds.split(",")
      : [];

    asistentesArr = asistentesArr.map(a => (typeof a === "string" ? a.trim() : a)).filter(Boolean);

    // VALIDACIÓN OBLIGATORIA (no permitir crear sin campos esenciales)
    if (
      !nombre ||
      !fecha ||
      !clienteId ||
      !coordinadorId ||
      asistentesArr.length < 1
    ) {
        return res.redirect("/eventos");
    }

    await eventosService.crear({
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      descripcion,
      clienteId,
      coordinadorId,
      asistentesIds: asistentesArr,
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
    if (!usuario) {
      return res.status(403).render("error", { mensaje: "Acceso denegado" });
    }

    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const usuarioId = usuario._id.toString();
    const clienteIdEvento =
      evento.clienteId?._id?.toString() ||
      evento.clienteId?.toString() ||
      null;

    const esAdminOCoor = ["admin", "coordinador"].includes(usuario.rol);
    const esClienteDueño =
      usuario.rol === "cliente" && clienteIdEvento === usuarioId;

    const esAsistenteAsignado =
      usuario.rol === "asistente" &&
      evento.asistentesIds?.some(a => a._id.toString() === usuarioId);

    // ADMIN / COORDINADOR → EDITAR
    if (esAdminOCoor) {
      const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
      const coordinadores = await Usuario.find({ rol: "coordinador" }).sort({ nombre: 1 });
      const asistentes = await Usuario.find({ rol: "asistente" }).sort({ nombre: 1 });

      evento.fechaFormateada = evento.fecha
        ? new Date(evento.fecha).toISOString().split("T")[0]
        : "";

      return res.render("editarEvento", {
        evento,
        clientes,
        coordinadores,
        asistentes,
        soloLectura: false,
        user: usuario
      });
    }

    // CLIENTE / ASISTENTE → SOLO DETALLES
    if (esClienteDueño || esAsistenteAsignado) {
      evento.fechaFormateada = evento.fecha
        ? new Date(evento.fecha).toISOString().split("T")[0]
        : "";

      return res.render("editarEvento", {
        evento,
        clientes: [],
        coordinadores: [],
        asistentes: [],
        soloLectura: true,
        user: usuario
      });
    }

    // OTROS → PROHIBIDO
    return res
      .status(403)
      .render("error", { mensaje: "No tienes permiso para ver este evento" });

  } catch (error) {
    console.error("Error en mostrarFormularioEdicion:", error);
    res.status(500).send("Error interno del servidor");
  }
}





async function guardarEdicionWeb(req, res) {
  try {
    const usuario = res.locals.user;

    // PERMISOS: solo admin o coordinador pueden editar
    if (!["admin", "coordinador"].includes(usuario.rol)) {
      return res
        .status(403)
        .render("error", { mensaje: "No tienes permiso para editar eventos" });
    }

    let {
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      clienteId,
      coordinadorId,
      asistentesIds,
      descripcion,
    } = req.body;

    // SI ES COORDINADOR → NO PUEDE CAMBIAR coordinadorId
    if (usuario.rol === "coordinador") {
      coordinadorId = usuario._id;
    }

    // Normalizar asistentes (acepta array o string con comas)
    let asistentesArr = Array.isArray(asistentesIds)
      ? asistentesIds
      : typeof asistentesIds === "string"
      ? asistentesIds.split(",")
      : [];

    asistentesArr = asistentesArr
      .map(a => (typeof a === "string" ? a.trim() : a))
      .filter(Boolean);

    // VALIDACIÓN BÁSICA
    if (!nombre || !fecha || !clienteId || !coordinadorId) {
      return res.status(400).render("error", { mensaje: "Faltan datos obligatorios." });
    }

    // Actualizar evento
    await eventosService.actualizar(req.params.id, {
      nombre,
      fecha,
      lugar,
      presupuesto,
      estado,
      descripcion,
      clienteId,
      coordinadorId,        
      asistentesIds: asistentesArr,
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

    const clienteEventoId = getClienteId(evento);

    const puedeAcceder =
      usuario.rol === "admin" ||
      usuario.rol === "coordinador" ||
      (usuario.rol === "asistente" &&
        evento.asistentesIds?.some(a => a._id?.toString() === usuario._id?.toString())) ||
      (usuario.rol === "cliente" &&
        clienteEventoId === usuario._id?.toString());

    if (!puedeAcceder) {
      return res
        .status(403)
        .render("error", { mensaje: "No tienes permiso para ver este chat" });
    }

    const fechaFormateada = evento.fecha
      ? new Date(evento.fecha).toISOString().split("T")[0]
      : "";

    res.render("chatEvento", {
      evento: { ...evento, id: evento._id.toString(), fechaFormateada },
      user: usuario
    });
  } catch (error) {
    console.error("Error al cargar chat:", error);
    res.status(500).send("Error al cargar chat");
  }
}



// ================================
// INVITADOS (web)
// ================================

async function mostrarInvitados(req, res) {
  try {
    const usuario = res.locals.user;
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const clienteEventoId = getClienteId(evento);

    const puedeVer =
      usuario.rol === "admin" ||
      usuario.rol === "coordinador" ||
      (usuario.rol === "asistente" &&
        evento.asistentesIds?.some(a => a._id?.toString() === usuario._id?.toString())) ||
      (usuario.rol === "cliente" && clienteEventoId === usuario._id?.toString());

    if (!puedeVer)
      return res
        .status(403)
        .render("error", { mensaje: "No tienes permiso para ver invitados" });

    // cliente → solo lectura
    const soloLectura = usuario.rol === "cliente";

    res.render("invitados", {
      evento,
      user: usuario,
      invitados: evento.invitados || [],
      soloLectura
    });

  } catch (error) {
    console.error("Error al mostrar invitados:", error);
    res.status(500).send("Error al cargar invitados");
  }
}


async function agregarInvitado(req, res) {
  try {
    const usuario = res.locals.user;
    const { id } = req.params;
    const { nombre } = req.body;

    const evento = await Evento.findById(id).populate("asistentesIds", "_id");
    if (!evento) return res.status(404).send("Evento no encontrado");

    const esAdminOCoor = ["admin","coordinador"].includes(usuario.rol);
    const esAsistenteAsignado = usuario.rol === "asistente" &&
      evento.asistentesIds.some(a => a._id.toString() === usuario._id.toString());

    if (!esAdminOCoor && !esAsistenteAsignado) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para agregar invitados" });
    }

    if (!nombre || !nombre.trim())
      return res.redirect(`/eventos/${id}/invitados`);

    evento.invitados = evento.invitados || [];
    evento.invitados.push({ nombre: nombre.trim(), estado: "pendiente" });

    await evento.save();
    res.redirect(`/eventos/${id}/invitados`);
  } catch (error) {
    console.error("Error al agregar invitado:", error);
    res.status(500).send("Error al agregar invitado");
  }
}


async function toggleInvitadoEstado(req, res) {
  try {
    const usuario = res.locals.user;
    const { id, index } = req.params;

    const evento = await Evento.findById(id).populate("asistentesIds", "_id");
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    const esAdminOCoor = ["admin","coordinador"].includes(usuario.rol);
    const esAsistenteAsignado = usuario.rol === "asistente" &&
      evento.asistentesIds.some(a => a._id.toString() === usuario._id.toString());

    if (!esAdminOCoor && !esAsistenteAsignado) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0 || !evento.invitados || idx >= evento.invitados.length) {
      return res.status(400).json({ error: "Invitado no encontrado" });
    }

    const actual = evento.invitados[idx];
    actual.estado = actual.estado === "confirmado" ? "pendiente" : "confirmado";

    await evento.save();
    res.json({ ok: true, invitado: actual });

  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ error: "Error interno" });
  }
}


async function eliminarInvitado(req, res) {
  try {
    const usuario = res.locals.user;
    const { id, index } = req.params;

    const evento = await Evento.findById(id).populate("asistentesIds", "_id");
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    const esAdminOCoor = ["admin","coordinador"].includes(usuario.rol);
    const esAsistenteAsignado = usuario.rol === "asistente" &&
      evento.asistentesIds.some(a => a._id.toString() === usuario._id.toString());

    if (!esAdminOCoor && !esAsistenteAsignado) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const idx = parseInt(index, 10);
    if (isNaN(idx) || !evento.invitados || idx < 0 || idx >= evento.invitados.length) {
      return res.status(400).json({ error: "Invitado no encontrado" });
    }

    evento.invitados.splice(idx, 1);
    await evento.save();

    res.json({ ok: true });

  } catch (error) {
    console.error("Error al eliminar invitado:", error);
    res.status(500).json({ error: "Error interno" });
  }
}


// ================================
// PRESUPUESTO / GASTOS (web)
// ================================

function getClienteId(evento) {
  return (
    evento.clienteId?._id?.toString() ||
    evento.clienteId?.toString() ||
    evento.cliente?._id?.toString() ||
    null
  );
}

async function mostrarPresupuesto(req, res) {
  try {
    const usuario = res.locals.user;
    const evento = await eventosService.obtenerConCliente(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");

    const clienteEventoId = getClienteId(evento);

    const puedeVer =
      usuario.rol === "admin" ||
      usuario.rol === "coordinador" ||
      (usuario.rol === "asistente" &&
        evento.asistentesIds?.some(a => a._id?.toString() === usuario._id?.toString())) ||
      (usuario.rol === "cliente" &&
        clienteEventoId === usuario._id?.toString());

    if (!puedeVer)
      return res
        .status(403)
        .render("error", { mensaje: "No tienes permiso para ver presupuesto" });

    const totalGastado = (evento.gastos || []).reduce(
      (s, g) => s + (g.monto || 0),
      0
    );

    res.render("presupuesto", {
      evento,
      gastos: evento.gastos || [],
      totalGastado,
      user: usuario,
    });
  } catch (error) {
    console.error("Error al mostrar presupuesto:", error);
    res.status(500).send("Error al cargar presupuesto");
  }
}



async function agregarGasto(req, res) {
  try {
    const usuario = res.locals.user;
    const { id } = req.params;
    const { descripcion, monto } = req.body;

    const evento = await Evento.findById(id).populate("asistentesIds", "_id");
    if (!evento) return res.status(404).send("Evento no encontrado");

    const esAdminOCoor = ["admin","coordinador"].includes(usuario.rol);
    const esAsistenteAsignado = usuario.rol === "asistente" &&
      evento.asistentesIds.some(a => a._id.toString() === usuario._id.toString());

    if (!esAdminOCoor && !esAsistenteAsignado) {
      return res.status(403).render("error", { mensaje: "No tienes permiso para agregar gastos" });
    }

    if (!descripcion || !descripcion.trim() || !monto) {
      return res.redirect(`/eventos/${id}/presupuesto`);
    }

    evento.gastos = evento.gastos || [];
    evento.gastos.push({
      descripcion: descripcion.trim(),
      monto: Number(monto),
    });

    await evento.save();
    res.redirect(`/eventos/${id}/presupuesto`);

  } catch (error) {
    console.error("Error al agregar gasto:", error);
    res.status(500).send("Error al agregar gasto");
  }
}


async function eliminarGasto(req, res) {
  try {
    const usuario = res.locals.user;
    const { id, index } = req.params;

    const evento = await Evento.findById(id).populate("asistentesIds", "_id");
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    const esAdminOCoor = ["admin","coordinador"].includes(usuario.rol);
    const esAsistenteAsignado = usuario.rol === "asistente" &&
      evento.asistentesIds.some(a => a._id.toString() === usuario._id.toString());

    if (!esAdminOCoor && !esAsistenteAsignado) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const idx = parseInt(index, 10);
    if (isNaN(idx) || !evento.gastos || idx < 0 || idx >= evento.gastos.length) {
      return res.status(400).json({ error: "Gasto no encontrado" });
    }

    evento.gastos.splice(idx, 1);
    await evento.save();

    res.json({ ok: true });

  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    res.status(500).json({ error: "Error interno" });
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
  mostrarFormularioCreacion,
  crearEventoWeb,
  mostrarFormularioEdicion,
  guardarEdicionWeb,
  mostrarChatEvento,

  // invitados
  mostrarInvitados,
  agregarInvitado,
  toggleInvitadoEstado,
  eliminarInvitado,

  // presupuesto
  mostrarPresupuesto,
  agregarGasto,
  eliminarGasto,
};
