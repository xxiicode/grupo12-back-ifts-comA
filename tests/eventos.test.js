import request from "supertest";
import app from "../app.js";
import Evento from "../models/Evento.js";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";
import { crearUsuario, tokenPara } from "./utils/test-helpers.js";

beforeAll(connectTestDB);
afterEach(clearDB);
afterAll(disconnectTestDB);

describe("POST /eventos/api - Crear evento", () => {

  test("Admin crea evento correctamente", async () => {
    const admin = await crearUsuario("admin", "admin");
    const cliente = await crearUsuario("juan", "cliente");
    const coord = await crearUsuario("carlos", "coordinador");
    const asis = await crearUsuario("ana", "asistente");

    const token = tokenPara(admin);

    const res = await request(app)
      .post("/eventos/api")
      .set("Authorization", "Bearer " + token)
      .send({
        nombre: "Evento Test",
        fecha: "2025-12-10",
        clienteId: cliente._id,
        coordinadorId: coord._id,
        asistentesIds: [asis._id]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Evento Test");

    const evento = await Evento.findOne({ nombre: "Evento Test" });
    expect(evento).not.toBeNull();
    expect(evento.clienteId.toString()).toBe(cliente._id.toString());
  });

  test("Cliente NO puede crear evento", async () => {
    const cliente = await crearUsuario("juan", "cliente");
    const token = tokenPara(cliente);

    const res = await request(app)
      .post("/eventos/api")
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "Evento Test Cliente" });

    expect(res.statusCode).toBe(403);
  });

});
