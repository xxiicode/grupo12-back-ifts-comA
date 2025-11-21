import { io as Client } from "socket.io-client";
import { startServer } from "../server.js";
import app from "../app.js";
import Evento from "../models/Evento.js";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";
import { crearUsuario, tokenPara } from "./utils/test-helpers.js";
import cookie from "cookie";

let httpServer;
let ioInstance;

beforeAll(async () => {
  await connectTestDB();
  httpServer = await startServer();
  ioInstance = app.get("io");
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await disconnectTestDB();

  if (httpServer?.close) {
    await new Promise((resolve) => httpServer.close(resolve));
  }

  if (ioInstance?.close) {
    ioInstance.close();
  }
});

describe("WebSockets", () => {

  test(
    "Asistente puede unirse al evento vía WS",
    async () => {
      const asistente = await crearUsuario("as1", "asistente");
      const cliente = await crearUsuario("cli", "cliente");

      const evento = await Evento.create({
        nombre: "WS Event",
        clienteId: cliente._id,
        coordinadorId: asistente._id,
        asistentesIds: [asistente._id],
        fecha: "2025-01-01"
      });

      const token = tokenPara(asistente);

      // Creamos el cliente WebSocket
      const client = Client("http://localhost:3000", {
        transports: ["websocket"],
        extraHeaders: {
          cookie: cookie.serialize("token", token)
        }
      });

      // promesa para esperar conexión
      await new Promise((resolve, reject) => {
        client.on("connect", () => {
          client.emit("joinEvent", { eventoId: evento._id.toString() });
          resolve();
        });

        client.on("connect_error", (err) => {
          reject(err);
        });
      });

      client.close(); // evitar handles abiertos
    },
    10000
  );

});
