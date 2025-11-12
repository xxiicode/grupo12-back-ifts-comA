import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import eventosRoutes from "./routes/eventos.js";
import clientesRoutes from "./routes/clientes.js";
import authRoutes from "./routes/auth.js";

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

//  ejecuta verificarToken 
app.use(verificarToken);

// =============================
// Rutas públicas (sin login)
// =============================
app.use("/auth", authRoutes);

// =============================
// Rutas protegidas con JWT + roles
// =============================

// Solo admin o coordinador pueden gestionar clientes
app.use("/clientes", autorizarRoles("admin", "coordinador"), clientesRoutes);

// Admin, coordinador y asistente pueden ver eventos
app.use("/eventos", autorizarRoles("admin", "coordinador", "asistente"), eventosRoutes);

// =============================
// Página de inicio (dashboard)
// =============================
app.get("/", (req, res) => {
  // Si hay usuario logueado, se muestra desde res.locals.user
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
