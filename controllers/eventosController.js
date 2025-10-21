// controllers/eventosController.js
import Evento from "../models/Evento.js";

// Mostrar lista de eventos
export const listarEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find();
    res.render("eventos", { eventos });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo evento
export const crearEvento = async (req, res, next) => {
  try {
    const { nombre, fecha, lugar, descripcion } = req.body;
    await Evento.create({ nombre, fecha, lugar, descripcion });
    res.redirect("/eventos");
  } catch (error) {
    next(error);
  }
};

// Mostrar formulario de edición
export const editarEventoForm = async (req, res, next) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).send("Evento no encontrado");
    res.render("editarEvento", { evento });
  } catch (error) {
    next(error);
  }
};

// Actualizar evento existente
export const actualizarEvento = async (req, res, next) => {
  try {
    const { nombre, fecha, lugar, descripcion } = req.body;
    await Evento.findByIdAndUpdate(req.params.id, { nombre, fecha, lugar, descripcion });
    res.redirect("/eventos");
  } catch (error) {
    next(error);
  }
};

// Eliminar evento
export const eliminarEvento = async (req, res, next) => {
  try {
    await Evento.findByIdAndDelete(req.params.id);
    res.redirect("/eventos");
  } catch (error) {
    next(error);
  }
};
