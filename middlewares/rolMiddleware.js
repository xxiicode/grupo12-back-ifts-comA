import Evento from "../models/Evento.js";

// =========================================
// Autorización tradicional por roles fijos
// =========================================
export function autorizarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).send("Acceso denegado");
    }
    next();
  };
}

// =========================================
// Autorizar gestión de invitados
// admin / coordinador / asistente asignado
// =========================================
export function autorizarInvitados() {
  return async (req, res, next) => {
    try {
      const usuario = req.user;
      const { id } = req.params; // id = evento

      if (!usuario) return res.status(403).send("Acceso denegado");

      // admin o coordinador → acceso total
      if (["admin", "coordinador"].includes(usuario.rol))
        return next();

      // asistente asignado al evento → permitido
      if (usuario.rol === "asistente") {
        const evento = await Evento.findById(id);
        if (evento?.asistentesIds?.some(a => a.toString() === usuario._id.toString()))
          return next();
      }

      return res.status(403).send("Acceso denegado");
    } catch (err) {
      console.error("Error en autorizarInvitados:", err);
      return res.status(500).send("Error interno");
    }
  };
}

// =========================================
// Autorizar gestión del presupuesto
// admin / coordinador / asistente asignado
// =========================================
export function autorizarPresupuesto() {
  return async (req, res, next) => {
    try {
      const usuario = req.user;
      const { id } = req.params; // evento

      if (!usuario) return res.status(403).send("Acceso denegado");

      // Admin o coordinador siempre pueden
      if (["admin", "coordinador"].includes(usuario.rol))
        return next();

      // Asistente asignado también puede
      if (usuario.rol === "asistente") {
        const evento = await Evento.findById(id);
        if (evento?.asistentesIds?.some(a => a.toString() === usuario._id.toString()))
          return next();
      }

      return res.status(403).send("Acceso denegado");
    } catch (err) {
      console.error("Error en autorizarPresupuesto:", err);
      return res.status(500).send("Error interno");
    }
  };
}
