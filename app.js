import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import eventosRoutes from "./routes/eventos.js";
import usuariosRoutes from "./routes/usuarios.js"; // CLIENTES
import usuariosAdminRoutes from "./routes/usuariosAdmin.js"; // USUARIOS GENERALES (ADMIN)
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

// Ejecuta verificarToken en todas las rutas (si existe JWT lo decodifica)
app.use(verificarToken);

// =============================
// Rutas públicas (sin login)
// =============================
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// =============================
// Rutas protegidas
// =============================

// CLIENTES (rol cliente) — accesible para ADMIN + COORDINADOR
// Ej: /usuarios/clientes
app.use(
  "/usuarios",
  verificarToken,
  autorizarRoles("admin", "coordinador"),
  usuariosRoutes
);

//  ADMINISTRACIÓN DE USUARIOS — SOLO ADMIN
// Ej: /usuarios/admin , /usuarios/admin/editar/:id
app.use(
  "/usuarios/admin",
  verificarToken,
  autorizarRoles("admin"),
  usuariosAdminRoutes
);

//  EVENTOS — accesible para ADMIN, COORDINADOR y ASISTENTE
app.use("/eventos", verificarToken, eventosRoutes);

// =============================
// Dashboard
// =============================
app.get("/", (req, res) => {
  res.render("index");
});

// =============================
// Manejo global de errores
// =============================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
