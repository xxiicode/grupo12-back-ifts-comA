import mongoose from "mongoose";

export async function conectarDB(uri = process.env.MONGO_URI) {
  try {
    await mongoose.connect(uri);
    console.log("Conectado correctamente a MongoDB");
  } catch (error) {
   if (process.env.NODE_ENV === "test") {
  // No matar Jest
  throw error;
} else {
  console.error("Error al conectar a MongoDB:", error.message);
  process.exit(1);
}
  }
}
