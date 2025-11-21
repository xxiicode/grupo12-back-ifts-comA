import jwt from "jsonwebtoken";
import Usuario from "../../models/Usuario.js";
import bcrypt from "bcrypt";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";

export async function crearUsuario(username, rol, password = "1234") {
  const passwordHash = await bcrypt.hash(password, 10);
  return Usuario.create({ username, passwordHash, rol });
}

export function tokenPara(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username, rol: user.rol },
    SECRET,
    { expiresIn: "1h" }
  );
}
