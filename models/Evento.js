class Evento {
  constructor(id, nombre, fecha, lugar, presupuesto, estado = 'Planificado') {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.lugar = lugar;
    this.presupuesto = Number(presupuesto) || 0;
    this.estado = estado;
  }
}

module.exports = Evento;
