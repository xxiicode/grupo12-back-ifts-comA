import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import eventosRoutes from "./routes/eventos.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

import { verificarToken } from "./middlewares/authMiddleware.js";
import { autorizarRoles } from "./middlewares/rolMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =============================
// Configuración de Pug
// =============================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// =============================
// Middlewares globales
// =============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cookieParser());

// Ejecuta verificarToken en todas las rutas (para decodificar JWT si existe)
app.use(verificarToken);

// =============================
// Rutas públicas (sin login)
// =============================
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// =============================
// Rutas protegidas con JWT + roles
// =============================

// Solo admin o coordinador pueden gestionar clientes (usuarios con rol "cliente")
app.use("/usuarios", verificarToken, autorizarRoles("admin", "coordinador"), usuariosRoutes);

// Admin, coordinador y asistente pueden gestionar eventos
app.use("/eventos", verificarToken, eventosRoutes);

// =============================
// Página de inicio (dashboard)
// =============================
app.get("/", (req, res) => {
  res.render("index");
});

// =============================
// Middleware global de errores
// =============================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
