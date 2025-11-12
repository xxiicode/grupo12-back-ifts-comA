import express from "express";
import { registrar, login, logout } from "../controllers/authController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizarRoles } from "../middlewares/rolMiddleware.js";

const router = express.Router();

router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);

// Registro visible solo para admin
router.get("/register", verificarToken, autorizarRoles("admin"), (req, res) => {
  res.render("register");
});
router.post("/register", verificarToken, autorizarRoles("admin"), registrar);

router.get("/logout", logout);

export default router;
