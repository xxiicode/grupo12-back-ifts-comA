import request from "supertest";
import app from "../app.js";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { connectTestDB, clearDB, disconnectTestDB } from "./utils/test-db.js";

beforeAll(connectTestDB);
afterEach(clearDB);
afterAll(disconnectTestDB);

describe("POST /auth/api/login", () => {
  test("Login correcto devuelve token", async () => {
    await Usuario.create({
      username: "admin",
      passwordHash: await bcrypt.hash("1234", 10),
      rol: "admin"
    });

    const res = await request(app)
      .post("/auth/api/login")
      .send({ username: "admin", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login falla si password es incorrecto", async () => {
    await Usuario.create({
      username: "admin",
      passwordHash: await bcrypt.hash("1234", 10),
      rol: "admin"
    });

    const res = await request(app)
      .post("/auth/api/login")
      .send({ username: "admin", password: "xx" });

    expect(res.statusCode).toBe(401);
  });
});
