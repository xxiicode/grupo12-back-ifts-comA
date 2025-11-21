import mongoose from "mongoose";

const invitadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: String, enum: ["confirmado", "pendiente"], default: "pendiente" }
}, { _id: false });

const gastoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  monto: { type: Number, required: true, default: 0 }
}, { _id: false });

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  descripcion: { type: String },
  lugar: { type: String },
  presupuesto: { type: Number, default: 0 }, // presupuesto estimado
  estado: { 
    type: String, 
    enum: ["Planificado", "En curso", "Finalizado", "Cancelado"],
    default: "Planificado"
  },

  // Cliente (OBLIGATORIO)
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

  // Invitados (no usuarios)
  invitados: [invitadoSchema],

  // Gastos / detalle de presupuesto
  gastos: [gastoSchema],
}, { timestamps: true });

eventoSchema.pre("save", function (next) {
  if (!this.asistentesIds || this.asistentesIds.length < 1) {
    return next(new Error("Debe asignarse al menos 1 asistente al evento."));
  }
  if (this.asistentesIds.length > 10) {
    return next(new Error("No se pueden asignar más de 10 asistentes al evento."));
  }
  next();
});

// Mapear id al serializar
eventoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Evento", eventoSchema);
