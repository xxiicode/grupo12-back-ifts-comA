// controllers/clientesController.js
import Cliente from "../models/Cliente.js";

// Mostrar lista de clientes
export const listarClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find();
    res.render("clientes", { clientes });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo cliente
export const crearCliente = async (req, res, next) => {
  try {
    const { nombre, email, telefono } = req.body;
    await Cliente.create({ nombre, email, telefono });
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
};

// Mostrar formulario de edición
export const editarClienteForm = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).send("Cliente no encontrado");
    res.render("editarCliente", { cliente });
  } catch (error) {
    next(error);
  }
};

// Actualizar cliente existente
export const actualizarCliente = async (req, res, next) => {
  try {
    const { nombre, email, telefono } = req.body;
    await Cliente.findByIdAndUpdate(req.params.id, { nombre, email, telefono });
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
};

// Eliminar cliente
export const eliminarCliente = async (req, res, next) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
};
