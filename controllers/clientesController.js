// filepath: c:\wamp64\www\grupo13-back-ifts-comA\controllers\clientesController.js
import * as clientesService from '../services/clienteService.js';
import * as eventosCtrl from './eventosController.js';

async function getAll() {
  return await clientesService.getAll();
}

async function getById(id) {
  return await clientesService.getById(id);
}

async function create(cliente) {
  return await clientesService.create(cliente);
}

async function update(id, data) {
  return await clientesService.update(id, data);
}

async function remove(id) {
  // Validar dependencias: no borrar cliente con eventos activos
  const eventos = await eventosCtrl.getAll();
  const usados = eventos.some(e => String(e.clienteId) === String(id));
  if (usados) return false;

  return await clientesService.remove(id);
}

export { getAll, getById, create, update, remove };