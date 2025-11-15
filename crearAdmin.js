import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function crearUsuariosIniciales() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB Atlas");

    // ========================
    // ADMIN PRINCIPAL
    // ========================
    const existeAdmin = await Usuario.findOne({ username: "admin" });
    if (!existeAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      const admin = new Usuario({
        username: "admin",
        passwordHash,
        nombre: "Administrador General",
        rol: "admin",
        dni: "20000000",
        email: "admin@eventify.com",
        telefono: "1100000000",
      });
      await admin.save();
      console.log("Usuario admin creado (user: admin / pass: admin123)");
    } else {
      console.log("Ya existe un usuario admin, no se creará otro.");
    }

    // ========================
    // USUARIOS DE PRUEBA
    // ========================
    const roles = [
      { rol: "cliente", cantidad: 2 },
      { rol: "coordinador", cantidad: 2 },
      { rol: "asistente", cantidad: 2 },
    ];

    for (const { rol, cantidad } of roles) {
      for (let i = 1; i <= cantidad; i++) {
        const username = `${rol}${i}`;
        const existe = await Usuario.findOne({ username });
        if (!existe) {
          const passwordHash = await bcrypt.hash("123456", 10);
          const nuevo = new Usuario({
            username,
            passwordHash,
            nombre: `${rol.charAt(0).toUpperCase() + rol.slice(1)} ${i}`,
            rol,
            dni: `${Math.floor(20000000 + Math.random() * 40000000)}`,
            email: `${username}@example.com`,
            telefono: `11${Math.floor(40000000 + Math.random() * 49999999)}`,
          });
          await nuevo.save();
          console.log(`Usuario ${rol} creado: ${username} / pass: 123456`);
        } else {
          console.log(`El usuario ${username} ya existe, omitido.`);
        }
      }
    }

    console.log("\n Creación de usuarios iniciales completada.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(" Error al crear usuarios iniciales:", error.message);
    process.exit(1);
  }
}

crearUsuariosIniciales();
