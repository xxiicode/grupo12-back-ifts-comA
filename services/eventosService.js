import Evento from "../models/Evento.js";

// ======================
// MÉTODOS CRUD GENERALES
// ======================

// Obtener todos los eventos (para API) — sin cliente pero con coordinador y asistentes
export async function obtenerTodos() {
  return await Evento.find()
    .populate("coordinadorId", "nombre username email rol")
    .populate("asistentesIds", "nombre username email rol")
    .sort({ fecha: 1 })
    .lean();
}

// Obtener evento por ID (para API)
export async function buscarPorId(id) {
  return await Evento.findById(id)
    .populate("clienteId", "nombre username email telefono dni")
    .populate("coordinadorId", "nombre username email rol")
    .populate("asistentesIds", "nombre username email rol")
    .lean();
}

// Crear nuevo evento
export async function crear(data) {
  const nuevoEvento = new Evento(data);
  return await nuevoEvento.save();
}

// Actualizar evento existente
export async function actualizar(id, data) {
  return await Evento.findByIdAndUpdate(id, data, {
    new: true
  })
    .populate("clienteId", "nombre username email telefono dni")
    .populate("coordinadorId", "nombre username email rol")
    .populate("asistentesIds", "nombre username email rol")
    .lean();
}

// Eliminar evento
export async function eliminar(id) {
  return await Evento.findByIdAndDelete(id);
}

// ======================================
// MÉTODOS ESPECÍFICOS PARA VISTAS (PUG)
// ======================================

// Obtener todos los eventos con datos completos (cliente + coordinador + asistentes)
export async function obtenerTodosConClientes() {
  return await Evento.find()
    .populate("clienteId", "nombre username email telefono dni")
    .populate("coordinadorId", "nombre username email rol")
    .populate("asistentesIds", "nombre username email rol")
    .sort({ fecha: 1 })
    .lean();
}

// Obtener un evento con cliente + relaciones (para chat o editar)
export async function obtenerConCliente(id) {
  return await Evento.findById(id)
    .populate("clienteId", "nombre username email telefono dni")
    .populate("coordinadorId", "nombre username email rol")
    .populate("asistentesIds", "nombre username email rol")
    .lean();
}
