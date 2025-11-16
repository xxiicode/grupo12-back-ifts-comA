import express from "express";
import { login, logout, registrar } from "../controllers/authController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Procesar login
router.post("/login", login);

// Cerrar sesión
router.get("/logout", logout);

// Mostrar formulario de registro (solo admin y coordinador verá select filtrado, pero la ruta sigue protegida)
router.get("/register", verificarToken, (req, res) => {
  // El view register.pug manejará el filtro de roles según res.locals.user
  res.render("register");
});

// Procesar registro: reglas:
// - admin puede crear cualquier rol
// - coordinador puede crear solo "asistente" y "cliente"
// - otros roles no pueden usar esta ruta
router.post("/register", verificarToken, (req, res, next) => {
  try {
    const rolSolicitado = req.body?.rol;
    const rolUsuario = req.user?.rol;

    if (!rolUsuario) return res.status(403).send("Acceso denegado");

    if (rolUsuario === "admin") return next();

    if (rolUsuario === "coordinador") {
      if (["asistente", "cliente"].includes(rolSolicitado)) return next();
      return res.status(403).render("register", { error: "No tienes permiso para crear ese rol." });
    }

    // resto de roles denegados
    return res.status(403).render("register", { error: "No tienes permiso para crear usuarios." });
  } catch (err) {
    console.error("Error en middleware register:", err);
    return res.status(500).render("register", { error: "Error interno." });
  }
}, registrar);

export default router;
