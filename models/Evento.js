import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  descripcion: { type: String },
  lugar: { type: String },
  presupuesto: { type: Number, default: 0 },
  estado: { type: String, default: "Planificado" },

  // Cliente (OBLIGATORIO según tu última confirmación)
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  // Coordinador único (OBLIGATORIO)
  coordinadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  // Lista de asistentes (mínimo 1, máximo 10)
  asistentesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
});

eventoSchema.pre("save", function (next) {
  if (!this.asistentesIds || this.asistentesIds.length < 1) {
    return next(new Error("Debe asignarse al menos 1 asistente al evento."));
  }
  if (this.asistentesIds.length > 10) {
    return next(new Error("No se pueden asignar más de 10 asistentes al evento."));
  }
  next();
});

// Cuando se haga toJSON, mapear id para las vistas (opcional, sigue estilo Usuario)
eventoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Evento", eventoSchema);
