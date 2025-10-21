import Cliente from '../models/Cliente.js';
import * as clientesService from '../services/clientesService.js';

// ========== CONTROLADORES API (MANEJAN REQ/RES) ==========

// Listar todos los clientes (API)
async function getAllClientes(req, res) {
  try {
    const clientes = await clientesService.obtenerTodos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', detalle: error.message });
  }
}

// Buscar cliente por ID
async function getClienteById(req, res) {
  try {
    const cliente = await clientesService.buscarPorId(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar cliente', detalle: error.message });
  }
}

// Crear nuevo cliente
async function createCliente(req, res) {
  try {
    const { nombre, email, telefono } = req.body;
    
    // Validaciones
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }
    
    const nuevoCliente = await clientesService.crear({ nombre, email, telefono });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', detalle: error.message });
  }
}

// Actualizar cliente
async function updateCliente(req, res) {
  try {
    const actualizado = await clientesService.actualizar(req.params.id, req.body);
    
    if (!actualizado) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', detalle: error.message });
  }
}

// Eliminar cliente
async function removeCliente(req, res) {
  try {
    // Validar dependencias: no borrar cliente con eventos activos
    const tieneEventos = await clientesService.tieneEventosActivos(req.params.id);
    
    if (tieneEventos) {
      return res.status(400).json({ 
        error: 'No se pudo eliminar (cliente tiene eventos activos)' 
      });
    }
    
    const eliminado = await clientesService.eliminar(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ ok: true, mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente', detalle: error.message });
  }
}

// ========== CONTROLADORES WEB (VISTAS PUG) ==========

// Listar todos los clientes (Vista)
async function listarClientes(req, res) {
  try {
    const clientes = await clientesService.obtenerTodos();
    res.render('clientes', { clientes });
  } catch (error) {
    res.status(500).send('Error al cargar clientes');
  }
}

// Crear nuevo cliente desde formulario web
async function crearClienteWeb(req, res) {
  try {
    const { nombre, email, telefono } = req.body;
    await clientesService.crear({ nombre, email, telefono });
    res.redirect('/clientes');
  } catch (error) {
    res.status(500).send('Error al crear cliente');
  }
}

// ========== FUNCIONES AUXILIARES (PARA OTROS CONTROLADORES) ==========

async function getAll() {
  return await clientesService.obtenerTodos();
}

async function getById(id) {
  return await clientesService.buscarPorId(id);
}

export { 
  // Controladores API
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  removeCliente,
  // Controladores Web
  listarClientes,
  crearClienteWeb,
  // Funciones auxiliares para otros módulos
  getAll,
  getById
};
