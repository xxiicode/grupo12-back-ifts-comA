import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date },
  descripcion: { type: String },
  lugar: { type: String },
  presupuesto: { type: Number, default: 0 },     
  estado: { type: String, default: "Planificado" }, 
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

export default mongoose.model("Evento", eventoSchema);
