import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

// Lista de nombres reales para todos los roles
const nombres = [
  "Juan Pérez", "María Gómez", "Carlos Díaz", "Laura Álvarez",
  "Martín Romero", "Sofía Fernández", "Diego Sosa", "Lucía Herrera",
  "Esteban Torres", "Valentina Ríos", "Germán González", "Paula Cabrera",
  "Tomás Navarro", "Carolina Duarte", "Federico Benítez"
];

// Funciones auxiliares
function nombreRandom() {
  return nombres[Math.floor(Math.random() * nombres.length)];
}

function dniRandom() {
  return String(Math.floor(20000000 + Math.random() * 30000000));
}

function emailRandom(nombre) {
  const base = nombre.toLowerCase().replace(/ /g, ".");
  return `${base}${Math.floor(Math.random() * 999)}@mail.com`;
}

function telefonoRandom() {
  return "11" + Math.floor(30000000 + Math.random() * 69999999);
}

async function crearUsuariosDemo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Conectado a MongoDB Atlas");

    // ======================================================
    // ADMIN PRINCIPAL
    // ======================================================
    const existeAdmin = await Usuario.findOne({ username: "admin" });

    if (!existeAdmin) {
      const pass = await bcrypt.hash("admin123", 10);
      await Usuario.create({
        username: "admin",
        passwordHash: pass,
        nombre: "Administrador General",
        rol: "admin",
        dni: "20000000",
        email: "admin@eventify.com",
        telefono: "1100000000"
      });
      console.log(" ✔ Admin creado: admin / admin123");
    } else {
      console.log(" Ya existe un admin, se omite.");
    }

    // ======================================================
    // COORDINADORES (5)
    // ======================================================
    console.log("\n Creando coordinadores...");
    for (let i = 0; i < 5; i++) {
      const nombre = nombreRandom();
      const username = `Coor. ${nombre}`;

      const existe = await Usuario.findOne({ username });
      if (existe) continue;

      await Usuario.create({
        username,
        passwordHash: await bcrypt.hash("123456", 10),
        nombre,
        rol: "coordinador",
        dni: dniRandom(),
        email: emailRandom(nombre),
        telefono: telefonoRandom()
      });

      console.log(` ✔ Coordinador: ${username} / pass 123456`);
    }

    // ======================================================
    // ASISTENTES (10)
    // ======================================================
    console.log("\n Creando asistentes...");
    for (let i = 0; i < 10; i++) {
      const nombre = nombreRandom();
      const username = `Asist. ${nombre}`;

      const existe = await Usuario.findOne({ username });
      if (existe) continue;

      await Usuario.create({
        username,
        passwordHash: await bcrypt.hash("123456", 10),
        nombre,
        rol: "asistente",
        dni: dniRandom(),
        email: emailRandom(nombre),
        telefono: telefonoRandom()
      });

      console.log(` ✔ Asistente: ${username} / pass 123456`);
    }

    // ======================================================
    // CLIENTES (10)
    // ======================================================
    console.log("\n Creando clientes...");
    for (let i = 0; i < 10; i++) {
      const nombre = nombreRandom();

      // Username estilo cliente: carlos.diaz23
      const base = nombre.toLowerCase().replace(/ /g, ".");
      const username = `${base}${Math.floor(Math.random() * 100)}`;

      const existe = await Usuario.findOne({ username });
      if (existe) continue;

      await Usuario.create({
        username,
        passwordHash: await bcrypt.hash("123456", 10),
        nombre,
        rol: "cliente",
        dni: dniRandom(),
        email: emailRandom(nombre),
        telefono: telefonoRandom()
      });

      console.log(` ✔ Cliente: ${username} / pass 123456`);
    }

    console.log("\n ✅ Creación de usuarios demo finalizada.");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error(" ❌ Error:", error.message);
    process.exit(1);
  }
}

crearUsuariosDemo();
