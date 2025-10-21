const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../data/eventos.json');

// ========== FUNCIONES DE BASE DE DATOS ==========

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

// ========== LÓGICA DE NEGOCIO (SERVICES) ==========

// Obtener todos los eventos
async function obtenerTodos() {
  return await readDB();
}

// Buscar evento por ID
async function buscarPorId(id) {
  const eventos = await readDB();
  return eventos.find(e => String(e.id) === String(id)) || null;
}

// Crear nuevo evento
async function crear(datosEvento) {
  const eventos = await readDB();
  const lastId = eventos.length ? Math.max(...eventos.map(e => Number(e.id))) : 0;
  
  const nuevoEvento = {
    id: lastId + 1,
    ...datosEvento
  };
  
  eventos.push(nuevoEvento);
  await writeDB(eventos);
  
  return nuevoEvento;
}

// Actualizar evento
async function actualizar(id, datosEvento) {
  const eventos = await readDB();
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  
  if (idx === -1) {
    return null;
  }
  
  eventos[idx] = { ...eventos[idx], ...datosEvento, id: eventos[idx].id };
  await writeDB(eventos);
  
  return eventos[idx];
}

// Eliminar evento
async function eliminar(id) {
  const eventos = await readDB();
  const idx = eventos.findIndex(e => String(e.id) === String(id));
  
  if (idx === -1) {
    return false;
  }
  
  eventos.splice(idx, 1);
  await writeDB(eventos);
  
  return true;
}

// Obtener evento con cliente incluido
async function obtenerConCliente(id) {
  const evento = await buscarPorId(id);
  if (!evento) return null;
  
  const clientesService = require('./clientesService');
  const cliente = await clientesService.buscarPorId(evento.clienteId);
  
  return { ...evento, cliente };
}

// Obtener eventos con sus clientes
async function obtenerTodosConClientes() {
  const eventos = await readDB();
  const clientesService = require('./clientesService');
  const clientes = await clientesService.obtenerTodos();
  
  return eventos.map(e => {
    const cliente = clientes.find(c => c.id == e.clienteId);
    return { ...e, cliente };
  });
}

module.exports = {
  obtenerTodos,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  obtenerConCliente,
  obtenerTodosConClientes
};
