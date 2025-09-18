const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../data/clientes.json');

async function ensureDB() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, '[]', 'utf-8');
  }
}

async function readDB() {
  await ensureDB();
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeDB(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function getAll() {
  return await readDB();
}

async function getById(id) {
  const clientes = await readDB();
  return clientes.find(c => String(c.id) === String(id)) || null;
}

async function create(cliente) {
  const clientes = await readDB();
  const lastId = clientes.length ? Math.max(...clientes.map(c => Number(c.id))) : 0;
  cliente.id = lastId + 1;
  clientes.push(cliente);
  await writeDB(clientes);
  return cliente;
}

async function update(id, data) {
  const clientes = await readDB();
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return null;
  clientes[idx] = { ...clientes[idx], ...data, id: clientes[idx].id };
  await writeDB(clientes);
  return clientes[idx];
}

async function remove(id) {
  //  Validar dependencias: no borrar cliente con eventos activos
  const eventosCtrl = require('./eventosController');
  const eventos = await eventosCtrl.getAll();
  const usados = eventos.some(e => String(e.clienteId) === String(id));
  if (usados) return false;

  const clientes = await readDB();
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return false;
  clientes.splice(idx, 1);
  await writeDB(clientes);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
