import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

// Listar clientes (usuarios con rol "cliente")
export async function listarClientes(req, res) {
  try {
    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    res.render("clientes", { clientes });
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).send("Error al listar clientes");
  }
}

// Mostrar formulario de edición
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

// Guardar cambios
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

// Eliminar cliente
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

// Registrar cliente (desde /usuarios/clientes/crear) - usado por coordinador y admin
export async function registrarCliente(req, res) {
  try {
    const { username, password, nombre, dni, email, telefono } = req.body;

    if (!username || !password) {
      const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
      return res.render("clientes", {
        clientes,
        error: "Faltan datos obligatorios."
      });
    }

    const existe = await Usuario.findOne({ username });
    if (existe) {
      const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
      return res.render("clientes", {
        clientes,
        error: "El usuario ya existe."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Usuario.create({
      username,
      passwordHash,
      nombre,
      dni,
      email,
      telefono,
      rol: "cliente"
    });

    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    return res.render("clientes", {
      clientes,
      success: `Cliente "${username}" creado correctamente.`
    });

  } catch (err) {
    console.error(err);
    const clientes = await Usuario.find({ rol: "cliente" }).sort({ nombre: 1 });
    return res.render("clientes", {
      clientes,
      error: "Error interno al crear cliente."
    });
  }
}


// ===============
// Vista principal
// ===============
export async function listarUsuarios(req, res) {
  const usuarios = await Usuario.find().lean();
  res.render("usuarios", { usuarios, user: req.user });
}

// ===============
// Vista editar
// ===============
export async function vistaEditarUsuario(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id).lean();
    if (!usuario) return res.status(404).send("Usuario no encontrado");

    res.render("editarUsuario", { usuario, user: req.user });
  } catch (error) {
    res.status(500).send("Error al cargar el usuario");
  }
}

// ===============
// Guardar edición
// ===============
export async function editarUsuario(req, res) {
  try {
    const { nombre, email, telefono, rol, dni } = req.body;

    await Usuario.findByIdAndUpdate(req.params.id, {
      nombre,
      email,
      telefono,
      rol,
      dni
    });

    res.redirect("/usuarios/admin");
  } catch (error) {
    res.status(500).send("No se pudo actualizar el usuario");
  }
}

// ===============
// Eliminar usuario
// ===============
export async function eliminarUsuario(req, res) {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: "No se pudo eliminar" });
  }
}
