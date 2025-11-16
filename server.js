import "dotenv/config.js";
import app from "./app.js";
import { conectarDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Mensaje from "./models/Mensaje.js";
import Usuario from "./models/Usuario.js";
import Evento from "./models/Evento.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";
const PORT = process.env.PORT || 3000;

(async () => {
  await conectarDB();

  const server = createServer(app);

  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }, // ajustar origen en producción
  });

  // Exponer io para usarlo en controladores si se necesita
  app.set("io", io);

  // ============================
  // Autenticación de sockets
  // ============================
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const cookies = cookie.parse(rawCookie || "");
      const token = cookies.token;
      if (!token) return next(); 
      const decoded = jwt.verify(token, SECRET);
      socket.user = decoded; // { id, username, rol }
      next();
    } catch (err) {
      console.log("Error al verificar token de socket:", err.message);
      next();
    }
  });

  // ============================
  // Conexión de clientes
  // ============================
  io.on("connection", (socket) => {
    console.log(" WS conectado:", socket.id, "user:", socket.user?.username || "anon");

    // Unirse a la sala del evento (canal del chat)
socket.on("joinEvent", async ({ eventoId }) => {
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) return socket.emit("errorEvento", { message: "Evento no encontrado" });

    const user = socket.user; // viene del middleware io.use()
    if (
      ["admin", "coordinador", "asistente"].includes(user.rol) ||
      (user.rol === "cliente" && evento.clienteId?.toString() === user.id)
    ) {
      socket.join(eventoId);
      console.log(` ${user.username} se unió a la sala ${eventoId}`);
    } else {
      socket.emit("errorEvento", { message: "No autorizado para este evento" });
    }
  } catch (err) {
    console.error("Error en joinEvent:", err);
  }
});


    // Recibir mensaje de chat
    socket.on("mensaje", async (data) => {
      try {
        const { eventoId, usuario, texto } = data;
        if (!eventoId || !texto.trim()) return;

        // Guardar mensaje en DB
        const nuevoMsg = await Mensaje.create({
          eventoId,
          usuarioId: usuario.id,
          usuarioNombre: usuario.username,
          rol: usuario.rol,
          contenido: texto,
        });

        // Emitir mensaje solo a usuarios conectados a ese evento
        io.to(eventoId).emit("mensaje", {
          usuario,
          texto,
          creadoEn: nuevoMsg.createdAt || new Date(),
        });
      } catch (err) {
        console.error("Error al procesar mensaje:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("WS desconectado:", socket.id);
    });
  });

  // ============================
  // Iniciar servidor HTTP
  // ============================
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})();
