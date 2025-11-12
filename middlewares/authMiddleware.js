import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";

export function verificarToken(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.locals.user = null; // ← aseguramos que las vistas sepan que no hay usuario
      return next();
    }

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    res.locals.user = decoded; // ← accesible en Pug
    next();
  } catch {
    res.clearCookie("token");
    res.locals.user = null;
    next();
  }
}
