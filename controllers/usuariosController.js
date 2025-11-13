import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

// ===========================
// Listar clientes (usuarios con rol "cliente")
// ===========================
export async function listarClientes(req, res) {
  try {
    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    res.render("clientes", { clientes });
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).send("Error al listar clientes");
  }
}

// ===========================
// Mostrar formulario de edición
// ===========================
export async function mostrarFormularioEdicion(req, res) {
  try {
    const cliente = await Usuario.findById(req.params.id);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(404).send("Cliente no encontrado");
    }
    res.render("editarCliente", { cliente });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar formulario de edición");
  }
}

// ===========================
// Guardar cambios
// ===========================
export async function guardarEdicion(req, res) {
  try {
    const { nombre, username, password, dni, email, telefono } = req.body;
    const cliente = await Usuario.findById(req.params.id);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(404).send("Cliente no encontrado");
    }

    cliente.nombre = nombre || cliente.nombre;
    cliente.username = username || cliente.username;
    cliente.dni = dni || cliente.dni;
    cliente.email = email || cliente.email;
    cliente.telefono = telefono || cliente.telefono;

    if (password && password.trim() !== "") {
      cliente.passwordHash = await bcrypt.hash(password, 10);
    }

    await cliente.save();
    res.redirect("/usuarios/clientes");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    res.status(500).send("Error al guardar cambios");
  }
}

// ===========================
// Eliminar cliente
// ===========================
export async function eliminarCliente(req, res) {
  try {
    const eliminado = await Usuario.findOneAndDelete({
      _id: req.params.id,
      rol: "cliente",
    });
    if (!eliminado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ ok: true, mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
}
