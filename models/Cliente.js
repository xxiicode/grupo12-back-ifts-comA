// models/Cliente.js
import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: String
});

export default mongoose.model("Cliente", clienteSchema);