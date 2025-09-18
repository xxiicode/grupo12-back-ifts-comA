import { readData, writeData } from "../models/db.js";

const getAllEventos = (req, res) => {
  const data = readData();
  res.json(data.eventos);
};

const getEventoById = (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const evento = data.eventos.find(e => e.id === id);
  if (evento) {
    res.json(evento);
  } else {
    res.status(404).json({ error: 'Evento no encontrado' });
  }
};

export { getAllEventos, getEventoById };
 
const createEvento = (req, res) => {
  const { titulo, fecha, ubicacion, clienteId } = req.body;
  if (!titulo || !fecha) {
    return res.status(400).json({ error: 'titulo y fecha son requeridos' });
  }
  const data = readData();
  const nuevo = {
    id: data.eventos.length + 1,
    titulo,
    fecha,
    ubicacion: ubicacion || '',
    clienteId: clienteId || null
  };
  data.eventos.push(nuevo);
  writeData(data);
  res.status(201).json(nuevo);
};

const deleteEvento = (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  const idx = data.eventos.findIndex(e => e.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }
  const [eliminado] = data.eventos.splice(idx, 1);
  writeData(data);
  res.status(200).json(eliminado);
};

export { createEvento, deleteEvento };
