import Evento from "../models/Evento.js";
import Cliente from "../models/Cliente.js";

// ========== LÓGICA DE NEGOCIO (SERVICES) ==========

// Obtener todos los eventos
async function obtenerTodos() {
  try {
    return await Evento.find().sort({ fecha: 1 });
  } catch (error) {
    throw new Error("Error al obtener eventos: " + error.message);
  }
}

// Buscar evento por ID
async function buscarPorId(id) {
  try {
    return await Evento.findById(id);
  } catch (error) {
    throw new Error("Error al buscar evento: " + error.message);
  }
}

// Crear nuevo evento
async function crear(datosEvento) {
  try {
    const nuevoEvento = new Evento(datosEvento);
    await nuevoEvento.save();
    return nuevoEvento;
  } catch (error) {
    throw new Error("Error al crear evento: " + error.message);
  }
}

// Actualizar evento
async function actualizar(id, datosEvento) {
  try {
    const actualizado = await Evento.findByIdAndUpdate(id, datosEvento, { new: true });
    return actualizado;
  } catch (error) {
    throw new Error("Error al actualizar evento: " + error.message);
  }
}

// Eliminar evento
async function eliminar(id) {
  try {
    const eliminado = await Evento.findByIdAndDelete(id);
    return !!eliminado;
  } catch (error) {
    throw new Error("Error al eliminar evento: " + error.message);
  }
}

// Obtener evento con cliente incluido
async function obtenerConCliente(id) {
  try {
    const evento = await Evento.findById(id).populate("clienteId", "nombre email telefono");
    return evento;
  } catch (error) {
    throw new Error("Error al obtener evento con cliente: " + error.message);
  }
}

// Obtener todos los eventos con sus clientes
async function obtenerTodosConClientes() {
  try {
    return await Evento.find().populate("clienteId", "nombre email telefono").sort({ fecha: 1 });
  } catch (error) {
    throw new Error("Error al obtener eventos con clientes: " + error.message);
  }
}

export {
  obtenerTodos,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  obtenerConCliente,
  obtenerTodosConClientes
};
