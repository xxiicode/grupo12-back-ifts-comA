const fs = require('fs').promises;
const path = require('path');
const clientesCtrl = require('./clientesController');

// Ruta al archivo JSON que usamos como "base de datos"
const dbPath = path.join(__dirname, '../data/eventos.json');

// Si el archivo no existe, lo crea vacío
async function ensureDB() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, '[]', 'utf-8');
  }
}

// Lee y devuelve el contenido del JSON
async function readDB() {
  await ensureDB();
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

// Guarda datos en el archivo JSON
async function writeDB(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Controlador: devuelve todos los eventos
async function getAll() {
  return await readDB();
}

// Controlador: busca un evento por ID
async function getById(id) {
  const eventos = await readDB();
  return eventos.find(e => String(e.id) === String(id)) || null;
}

// Controlador: crea un nuevo evento
async function create(evento) {
  const eventos = await readDB();
  const lastId = eventos.length ? Math.max(...eventos.map(e => Number(e.id))) : 0;
  evento.id = lastId + 1;
  eventos.push(evento);
  await writeDB(eventos);
  return evento;
}

// Controlador: actualiza un evento existente
async function update(id, data) {
  const eventos = await readDB();
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  if (idx === -1) return null;
  eventos[idx] = { ...eventos[idx], ...data, id: eventos[idx].id };
  await writeDB(eventos);
  return eventos[idx];
}

// Controlador: elimina un evento
async function remove(id) {
  const eventos = await readDB();
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  if (idx === -1) return false;
  eventos.splice(idx, 1);
  await writeDB(eventos);
  return true;
}

// Controlador: devuelve un evento con su cliente incluido
async function getByIdWithCliente(id) {
  const evento = await getById(id); // usamos la función que ya tenés
  if (!evento) return null;
  const cliente = await clientesCtrl.getById(evento.clienteId);
  return { ...evento, cliente };
}

module.exports = { getAll, getById, create, update, remove, getByIdWithCliente };
