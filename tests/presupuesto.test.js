import request from "supertest";
import app from "../app.js";
import Evento from "../models/Evento.js";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";
import { crearUsuario, tokenPara } from "./utils/test-helpers.js";

beforeAll(connectTestDB);
afterEach(clearDB);
afterAll(disconnectTestDB);

describe("Presupuesto", () => {

  test("Admin puede agregar ítem de presupuesto", async () => {
    const admin = await crearUsuario("admin", "admin");
    const cliente = await crearUsuario("cli", "cliente");
    const asistente = await crearUsuario("asis", "asistente");

    const evento = await Evento.create({
      nombre: "Evento Presupuesto",
      clienteId: cliente._id,
      asistentesIds: [asistente._id],
      coordinadorId: admin._id,
      fecha: "2025-01-01",
      presupuesto: 0,   
      gastos: []        
    });

    const token = tokenPara(admin);

    const res = await request(app)
      .post(`/eventos/${evento._id}/presupuesto`)
      .set("Authorization", "Bearer " + token)
      .send({
        titulo: "Catering",
        monto: 250000
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.gastos.length).toBe(1);     
  });

});
