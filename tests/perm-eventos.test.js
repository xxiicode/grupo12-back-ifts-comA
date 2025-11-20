import request from "supertest";
import app from "../app.js";
import Evento from "../models/Evento.js";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";
import { crearUsuario, tokenPara } from "./utils/test-helpers.js";

beforeAll(connectTestDB);
afterEach(clearDB);
afterAll(disconnectTestDB);

describe("Permisos de evento", () => {

  test("Asistente asignado puede ver detalles", async () => {
    const admin = await crearUsuario("admin", "admin");
    const asistente = await crearUsuario("as1", "asistente");
    const cliente = await crearUsuario("cli", "cliente");
    const coord = await crearUsuario("cor", "coordinador");

    const evento = await Evento.create({
      nombre: "Test",
      clienteId: cliente._id,
      coordinadorId: coord._id,
      asistentesIds: [asistente._id],
      fecha: "2025-01-01"
    });

    const token = tokenPara(asistente);

    const res = await request(app)
      .get("/eventos/editar/" + evento._id)
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(200);
  });

  test("Cliente NO puede ver detalles de eventos de otros clientes", async () => {
    const cliente = await crearUsuario("cli", "cliente");
    const otroCli = await crearUsuario("otro", "cliente");
    const asistente = await crearUsuario("as1", "asistente");
    const coord = await crearUsuario("cor", "coordinador");

    const evento = await Evento.create({
      nombre: "Test2",
      clienteId: cliente._id,
      coordinadorId: coord._id,
      asistentesIds: [asistente._id],
      fecha: "2025-01-01"
    });

    const token = tokenPara(otroCli);

    const res = await request(app)
      .get("/eventos/editar/" + evento._id)
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toBe(403);
  });

});
