// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import clientesRoutes from "./routes/clientes.js";
import eventosRoutes from "./routes/eventos.js";

dotenv.config(); // Cargar variables del .env

const app = express();
const PORT = process.env.PORT || 3000;

// Para resolver __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración básica de Express
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
console.log("MONGO_URI leído desde .env:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión:", err));

// Rutas
app.use("/clientes", clientesRoutes);
app.use("/eventos", eventosRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.render("index");
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
