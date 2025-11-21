import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta123";

export function verificarToken(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decoded = jwt.verify(token, SECRET);

    req.user = { ...decoded, _id: decoded.id };
    res.locals.user = { ...decoded, _id: decoded.id };

    next();
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.clearCookie("token");
    res.locals.user = null;
    next();
  }
}
