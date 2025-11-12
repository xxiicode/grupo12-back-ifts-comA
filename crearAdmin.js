import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function crearAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a Mongo Atlas");

    const existe = await Usuario.findOne({ username: "admin" });
    if (existe) {
      console.log("⚠️ Ya existe un usuario admin, no se creará otro.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("admin123", 10);
    const nuevoAdmin = new Usuario({
      username: "admin",
      passwordHash,
      nombre: "Administrador General",
      rol: "admin"
    });

    await nuevoAdmin.save();
    console.log("✅ Usuario admin creado correctamente (user: admin / pass: admin123)");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error al crear admin:", error.message);
    process.exit(1);
  }
}

crearAdmin();
