import Cliente from "../models/Cliente.js";
import Evento from "../models/Evento.js";

// ========== LÓGICA DE NEGOCIO (SERVICES) ==========

// Obtener todos los clientes
async function obtenerTodos() {
  try {
    return await Cliente.find().sort({ nombre: 1 });
  } catch (error) {
    throw new Error("Error al obtener clientes: " + error.message);
  }
}

// Buscar cliente por ID
async function buscarPorId(id) {
  try {
    return await Cliente.findById(id);
  } catch (error) {
    throw new Error("Error al buscar cliente: " + error.message);
  }
}

// Crear nuevo cliente
async function crear(datosCliente) {
  try {
    const nuevoCliente = new Cliente(datosCliente);
    await nuevoCliente.save();
    return nuevoCliente;
  } catch (error) {
    throw new Error("Error al crear cliente: " + error.message);
  }
}

// Actualizar cliente
async function actualizar(id, datosCliente) {
  try {
    const actualizado = await Cliente.findByIdAndUpdate(id, datosCliente, { new: true });
    return actualizado;
  } catch (error) {
    throw new Error("Error al actualizar cliente: " + error.message);
  }
}

// Eliminar cliente
async function eliminar(id) {
  try {
    const eliminado = await Cliente.findByIdAndDelete(id);
    return !!eliminado;
  } catch (error) {
    throw new Error("Error al eliminar cliente: " + error.message);
  }
}

// Validar si cliente tiene eventos activos
async function tieneEventosActivos(clienteId) {
  try {
    const eventos = await Evento.find({ clienteId });
    return eventos.length > 0;
  } catch (error) {
    throw new Error("Error al verificar eventos activos: " + error.message);
  }
}

export {
  obtenerTodos,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  tieneEventosActivos
};
