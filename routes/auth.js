import express from "express";
import { login, logout, registrar } from "../controllers/authController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

//  Mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("login");
});

//  Procesar login
router.post("/login", login);

//  Cerrar sesión
router.get("/logout", logout);

//  Mostrar formulario de registro (solo admin)
router.get("/register", verificarToken, autorizarRoles("admin"), (req, res) => {
  res.render("register");
});

//  Procesar registro (solo admin)
router.post("/register", verificarToken, autorizarRoles("admin"), registrar);

export default router;
