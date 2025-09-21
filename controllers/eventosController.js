import eventosService from '../services/eventosService.js';
import * as clientesCtrl from './clientesController.js';

async function getAll() {
  return await eventosService.getAll();
}

async function getById(id) {
  return await eventosService.getById(id);
}

async function create(evento) {
  return await eventosService.create(evento);
}

async function update(id, data) {
  return await eventosService.update(id, data);
}

async function remove(id) {
  return await eventosService.remove(id);
}

async function getByIdWithCliente(id) {
  const evento = await getById(id);
  if (!evento) return null;
  const cliente = await clientesCtrl.getById(evento.clienteId);
  return { ...evento, cliente };
}

export { getAll, getById, create, update, remove, getByIdWithCliente };