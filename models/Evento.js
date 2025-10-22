import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  lugar: String,
  presupuesto: { type: Number, default: 0 },
  estado: { type: String, enum: ["Planificado", "En curso", "Finalizado"], default: "Planificado" },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }
});

export default mongoose.model("Evento", eventoSchema);

