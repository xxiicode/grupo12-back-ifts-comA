import Evento from "../models/Evento.js";

// =========================================
// SERVICIO DE EVENTOS (CAPA INTERMEDIA)
// =========================================
// Encapsula toda la lógica de acceso a la base de datos,
// manteniendo el código más limpio en el controlador.

// Obtener todos los eventos (sin cliente)
export async function obtenerTodos() {
  return await Evento.find().sort({ fecha: 1 });
}

// Obtener evento por ID (sin cliente)
export async function buscarPorId(id) {
  return await Evento.findById(id);
}

// Crear nuevo evento
export async function crear(data) {
  const nuevoEvento = new Evento(data);
  return await nuevoEvento.save();
}

// Actualizar evento existente
export async function actualizar(id, data) {
  const eventoActualizado = await Evento.findByIdAndUpdate(id, data, { new: true });
  return eventoActualizado;
}

// Eliminar evento
export async function eliminar(id) {
  const eliminado = await Evento.findByIdAndDelete(id);
  return eliminado;
}

// =========================================
// MÉTODOS CON RELACIONES (populate)
// =========================================

// Obtener todos los eventos con datos del cliente
export async function obtenerTodosConClientes() {
  return await Evento.find()
    .populate("clienteId", "nombre username email telefono dni")
    .sort({ fecha: 1 });
}

// Obtener un evento con su cliente asignado
export async function obtenerConCliente(id) {
  return await Evento.findById(id)
    .populate("clienteId", "nombre username email telefono dni");
}
