const path = require('path');
const { readDB, writeDB } = require('./dbService');

const dbPath = path.join(__dirname, '../data/clientes.json');

async function getAll() {
  return await readDB(dbPath);
}

async function getById(id) {
  const clientes = await readDB(dbPath);
  return clientes.find(c => String(c.id) === String(id)) || null;
}

async function create(cliente) {
  const clientes = await readDB(dbPath);
  const lastId = clientes.length ? Math.max(...clientes.map(c => Number(c.id))) : 0;
  cliente.id = lastId + 1;
  clientes.push(cliente);
  await writeDB(dbPath, clientes);
  return cliente;
}

async function update(id, data) {
  const clientes = await readDB(dbPath);
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return null;
  clientes[idx] = { ...clientes[idx], ...data, id: clientes[idx].id };
  await writeDB(dbPath, clientes);
  return clientes[idx];
}

async function remove(id) {
  const clientes = await readDB(dbPath);
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return false;
  clientes.splice(idx, 1);
  await writeDB(dbPath, clientes);
  return true;
}

module.exports = { getAll, getById, create, update, remove };