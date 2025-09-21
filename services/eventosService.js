const path = require('path');
const { readDB, writeDB } = require('./dbService');

const dbPath = path.join(__dirname, '../data/eventos.json');

async function getAll() {
  return await readDB(dbPath);
}

async function getById(id) {
  const eventos = await readDB(dbPath);
  return eventos.find(e => String(e.id) === String(id)) || null;
}

async function create(evento) {
  const eventos = await readDB(dbPath);
  const lastId = eventos.length ? Math.max(...eventos.map(e => Number(e.id))) : 0;
  evento.id = lastId + 1;
  eventos.push(evento);
  await writeDB(dbPath, eventos);
  return evento;
}

async function update(id, data) {
  const eventos = await readDB(dbPath);
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  if (idx === -1) return null;
  eventos[idx] = { ...eventos[idx], ...data, id: eventos[idx].id };
  await writeDB(dbPath, eventos);
  return eventos[idx];
}

async function remove(id) {
  const eventos = await readDB(dbPath);
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  if (idx === -1) return false;
  eventos.splice(idx, 1);
  await writeDB(dbPath, eventos);
  return true;
}

module.exports = { getAll, getById, create, update, remove };