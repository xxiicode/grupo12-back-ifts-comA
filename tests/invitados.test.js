import request from "supertest";
import app from "../app.js";
import Evento from "../models/Evento.js";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";
import { crearUsuario, tokenPara } from "./utils/test-helpers.js";

beforeAll(connectTestDB);
afterEach(clearDB);
afterAll(disconnectTestDB);

describe("Invitados de evento", () => {

  test("Coordinador puede agregar invitado", async () => {
    const coord = await crearUsuario("coor", "coordinador");
    const cliente = await crearUsuario("cli", "cliente");
    const asistente = await crearUsuario("asis", "asistente");

    const evento = await Evento.create({
      nombre: "Evento X",
      clienteId: cliente._id,
      coordinadorId: coord._id,
      asistentesIds: [asistente._id],
      fecha: "2025-01-01",
      invitados: []
    });

    const token = tokenPara(coord);

    const res = await request(app)
      .post(`/eventos/${evento._id}/invitados`)
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "Juan Pérez" });

    expect(res.statusCode).toBe(200);
    expect(res.body.invitados.length).toBe(1);
  });

});
