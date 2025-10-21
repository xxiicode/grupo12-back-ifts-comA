// models/Evento.js
import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  lugar: { type: String, required: true },
  descripcion: String
});

export default mongoose.model("Evento", eventoSchema);
