import mongoose from "mongoose";

export async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("Conectado correctamente a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // corta la ejecución si no conecta
  }
}
