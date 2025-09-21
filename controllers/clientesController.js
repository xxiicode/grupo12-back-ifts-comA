import * as clientesService from '../services/clientesService.js';

// ---------- FUNCIONES API (JSON) ----------

// GET /clientes/api - Obtener todos los clientes (JSON)
export function getClientes() {
  return async (req, res) => {
    try {
      const clientes = await clientesService.getClientes();
      res.json(clientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  };
}

// GET /clientes/api/:id - Obtener cliente por ID (JSON)
export function getCliente() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await clientesService.getCliente(id);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.json(cliente);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  };
}

// POST /clientes/api - Crear nuevo cliente (JSON)
export function createCliente() {
  return async (req, res) => {
    try {
      const nuevoCliente = await clientesService.createCliente(req.body);
      res.status(201).json(nuevoCliente);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  };
}

// PUT /clientes/api/:id - Actualizar cliente (JSON)
export function updateCliente() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const clienteActualizado = await clientesService.updateCliente(id, req.body);
      
      if (!clienteActualizado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.json(clienteActualizado);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  };
}

// DELETE /clientes/api/:id - Eliminar cliente (JSON)
export function deleteCliente() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await clientesService.deleteCliente(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  };
}