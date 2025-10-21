import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev")); // Log de peticiones HTTP

// Rutas
import eventosRoutes from "./routes/eventos.js";
import clientesRoutes from "./routes/clientes.js";

app.use("/eventos", eventosRoutes);
app.use("/clientes", clientesRoutes);

// Página de inicio
app.get("/", (req, res) => {
  res.render("index");
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
