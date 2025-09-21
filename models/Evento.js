class Evento {
  constructor(id, nombre, fecha, lugar, presupuesto, estado = 'Planificado', clienteId = null) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.lugar = lugar;
    this.presupuesto = Number(presupuesto) || 0;
    this.estado = estado;
    this.clienteId = clienteId ? Number(clienteId) : null;
  }
}

export default Evento;

