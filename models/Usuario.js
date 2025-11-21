import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  nombre: { type: String },
  rol: { 
    type: String, 
    enum: ["admin", "coordinador", "asistente", "cliente"], 
    default: "asistente" 
  },

  dni: { type: String },
  email: { type: String, unique: false }, //  unique: true para evitar duplicados
  telefono: { type: String }
});

usuarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

export default mongoose.model("Usuario", usuarioSchema);
