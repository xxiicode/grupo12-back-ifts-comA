import path from 'path';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from './db.js';
import Cliente from '../models/Cliente.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENTES_DB = path.join(__dirname, '..', 'data', 'clientes.json');

// Obtener todos los clientes
export async function getClientes() {
  return await readDB(CLIENTES_DB);
}

// Obtener cliente por ID
export async function getCliente(id) {
  const clientes = await readDB(CLIENTES_DB);
  return clientes.find(cliente => cliente.id == id);
}

// Crear nuevo cliente
export async function createCliente(clienteData) {
  const clientes = await readDB(CLIENTES_DB);

  // Generar nuevo ID
  const maxId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) : 0;
  const nuevoCliente = new Cliente(maxId + 1, clienteData.nombre, clienteData.email, clienteData.telefono);

  clientes.push(nuevoCliente);
  await writeDB(CLIENTES_DB, clientes);

  return nuevoCliente;
}

// Actualizar cliente
export async function updateCliente(id, clienteData) {
  const clientes = await readDB(CLIENTES_DB);
  const index = clientes.findIndex(cliente => cliente.id == id);
  
  if (index === -1) {
    return null;
  }
  
  clientes[index] = { ...clientes[index], ...clienteData, id: parseInt(id) };
  await writeDB(CLIENTES_DB, clientes);
  
  return clientes[index];
}

// Eliminar cliente
export async function deleteCliente(id) {
  const clientes = await readDB(CLIENTES_DB);
  const index = clientes.findIndex(cliente => cliente.id == id);
  
  if (index === -1) {
    return false;
  }
  
  clientes.splice(index, 1);
  await writeDB(CLIENTES_DB, clientes);
  
  return true;
}