import "dotenv/config.js";
import app from "./app.js";
import { conectarDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Mensaje from "./models/Mensaje.js";
import Evento from "./models/Evento.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";
const PORT = process.env.PORT || 3000;

export async function startServer() {
  if (process.env.NODE_ENV !== "test") {
    await conectarDB();
  }

  const server = createServer(app);
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  app.set("io", io);

  // ============================
  // Middleware autenticación sockets
  // ============================
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const cookies = cookie.parse(rawCookie || "");
      const token = cookies.token;
      if (!token) return next();
      const decoded = jwt.verify(token, SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.log("Error al verificar token de socket:", err.message);
      next();
    }
  });

  // ============================
  // Conexión WebSocket
  // ============================
  io.on("connection", (socket) => {
    console.log("WS conectado:", socket.id);

    socket.on("joinEvent", async ({ eventoId }) => {
      try {
        const evento = await Evento.findById(eventoId);
        if (!evento)
          return socket.emit("errorEvento", { message: "Evento no encontrado" });

        const user = socket.user;
        if (
          ["admin", "coordinador", "asistente"].includes(user.rol) ||
          (user.rol === "cliente" && evento.clienteId?.toString() === user.id)
        ) {
          socket.join(eventoId);
        } else {
          socket.emit("errorEvento", { message: "No autorizado" });
        }
      } catch (err) {
        console.error("joinEvent error:", err);
      }
    });

    socket.on("mensaje", async (data) => {
      try {
        const { eventoId, usuario, texto } = data;
        if (!eventoId || !texto.trim()) return;

        const nuevoMsg = await Mensaje.create({
          eventoId,
          usuarioId: usuario.id,
          usuarioNombre: usuario.username,
          rol: usuario.rol,
          contenido: texto,
        });

        app.get("io").to(eventoId).emit("mensaje", {
          usuario,
          texto,
          creadoEn: nuevoMsg.createdAt,
        });
      } catch (err) {
        console.error("mensaje error:", err);
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  return server;
}

// Solo inicia si NO estamos en test
if (process.env.NODE_ENV !== "test") {
  startServer().catch((error) => {
    console.error("Error al iniciar servidor:", error.message);
    
  });
}

