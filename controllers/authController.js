import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";

// LOGIN
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(401).render("login", { error: "Usuario no encontrado" });
    }

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      return res.status(401).render("login", { error: "Credenciales inválidas" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, rol: usuario.rol },
      SECRET,
      { expiresIn: "2h" }
    );

    // Guardar token en cookie httpOnly
    res.cookie("token", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });

    // Redirigir al inicio
    res.redirect("/");
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).render("login", { error: "Error interno del servidor" });
  }
}

//  LOGOUT
export async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.render("login", { success: "Sesión cerrada correctamente." });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).render("login", { error: "Error al cerrar sesión" });
  }
}

//  REGISTRAR NUEVO USUARIO
export async function registrar(req, res) {
  try {
    const { username, password, nombre, rol } = req.body;

    // Validar datos
    if (!username || !password || !rol) {
      return res.status(400).render("register", { error: "Faltan datos obligatorios." });
    }

    // Verificar si ya existe un usuario con el mismo nombre
    const existente = await Usuario.findOne({ username });
    if (existente) {
      return res.status(400).render("register", { error: "El nombre de usuario ya está registrado." });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      passwordHash,
      nombre,
      rol,
    });

    await nuevoUsuario.save();

    // Mostrar confirmación
    res.render("register", { success: `Usuario "${username}" registrado correctamente.` });
  } catch (error) {
    console.error("Error en registrar:", error);
    res.status(500).render("register", { error: "Error interno del servidor." });
  }
}
