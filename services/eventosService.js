import path from 'path';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from './db.js';
import Evento from '../models/Evento.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTOS_DB = path.join(__dirname, '..', 'data', 'eventos.json');

// Obtener todos los eventos
export async function getEventos() {
  return await readDB(EVENTOS_DB);
}

// Obtener evento por ID
export async function getEvento(id) {
  const eventos = await readDB(EVENTOS_DB);
  return eventos.find(evento => evento.id == id);
}

// Crear nuevo evento
export async function createEvento(eventoData) {
  const eventos = await readDB(EVENTOS_DB);

  // Generar nuevo ID
  const maxId = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) : 0;
  const nuevoEvento = new Evento(maxId + 1, eventoData.nombre, eventoData.fecha, eventoData.lugar, eventoData.presupuesto, eventoData.estado, eventoData.clienteId);

  eventos.push(nuevoEvento);
  await writeDB(EVENTOS_DB, eventos);

  return nuevoEvento;
}

// Actualizar evento
export async function updateEvento(id, eventoData) {
  const eventos = await readDB(EVENTOS_DB);
  const index = eventos.findIndex(evento => evento.id == id);
  
  if (index === -1) {
    return null;
  }
  
  eventos[index] = { ...eventos[index], ...eventoData, id: parseInt(id) };
  await writeDB(EVENTOS_DB, eventos);
  
  return eventos[index];
}

// Eliminar evento
export async function deleteEvento(id) {
  const eventos = await readDB(EVENTOS_DB);
  const index = eventos.findIndex(evento => evento.id == id);
  
  if (index === -1) {
    return false;
  }
  
  eventos.splice(index, 1);
  await writeDB(EVENTOS_DB, eventos);
  
  return true;
}