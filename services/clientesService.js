import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/clientes.json');

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

// Obtener todos los clientes
async function obtenerTodos() {
  return await readDB();
}

// Buscar cliente por ID
async function buscarPorId(id) {
  const clientes = await readDB();
  return clientes.find(c => String(c.id) === String(id)) || null;
}

// Crear nuevo cliente
async function crear(datosCliente) {
  const clientes = await readDB();
  const lastId = clientes.length ? Math.max(...clientes.map(c => Number(c.id))) : 0;
  
  const nuevoCliente = {
    id: lastId + 1,
    ...datosCliente
  };
  
  clientes.push(nuevoCliente);
  await writeDB(clientes);
  
  return nuevoCliente;
}

// Actualizar cliente
async function actualizar(id, datosCliente) {
  const clientes = await readDB();
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  
  if (idx === -1) {
    return null;
  }
  
  clientes[idx] = { ...clientes[idx], ...datosCliente, id: clientes[idx].id };
  await writeDB(clientes);
  
  return clientes[idx];
}

// Eliminar cliente
async function eliminar(id) {
  const clientes = await readDB();
  const idx = clientes.findIndex(c => String(c.id) === String(id));
  
  if (idx === -1) {
    return false;
  }
  
  clientes.splice(idx, 1);
  await writeDB(clientes);
  
  return true;
}

// Validar si cliente tiene eventos activos
async function tieneEventosActivos(clienteId) {
  const { obtenerTodos } = await import('./eventosService.js');
  const eventos = await obtenerTodos();
  return eventos.some(e => String(e.clienteId) === String(clienteId));
}

export {
  obtenerTodos,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  tieneEventosActivos
};
