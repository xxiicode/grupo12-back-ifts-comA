import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";

export async function registrar(req, res) {
  try {
    const { username, password, nombre, rol } = req.body;

    const existe = await Usuario.findOne({ username });
    if (existe) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ username, passwordHash, nombre, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar", detalle: error.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ username });
    const valido = usuario && await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, rol: usuario.rol },
      SECRET,
      { expiresIn: "2h" }
    );

    // Guarda token en cookie httpOnly
    res.cookie("token", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
    res.redirect("/"); // Redirige al inicio tras login
  } catch (error) {
    res.status(500).json({ error: "Error en login", detalle: error.message });
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
}
