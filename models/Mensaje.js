import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema(
  {
    eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "Evento", required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    usuarioNombre: String,
    rol: String,
    contenido: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Mensaje", mensajeSchema);
