const Evento = require('../models/Evento');
const eventosService = require('../services/eventosService');
const clientesService = require('../services/clientesService');

// ========== CONTROLADORES API (MANEJAN REQ/RES) ==========

// Obtener todos los eventos (API)
async function getAllEventos(req, res) {
  try {
    const eventos = await eventosService.obtenerTodos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos', detalle: error.message });
  }
}

// Obtener un evento por ID (API)
async function getEventoById(req, res) {
  try {
    const evento = await eventosService.buscarPorId(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar evento', detalle: error.message });
  }
}

// Crear nuevo evento (API)
async function createEvento(req, res) {
  try {
    const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
    
    // Validaciones
    if (!nombre || !fecha || !clienteId) {
      return res.status(400).json({ error: 'Nombre, fecha y clienteId son obligatorios' });
    }
    
    const nuevoEvento = await eventosService.crear({ 
      nombre, 
      fecha, 
      lugar, 
      presupuesto, 
      estado, 
      clienteId 
    });
    
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento', detalle: error.message });
  }
}

// Actualizar evento (API)
async function updateEvento(req, res) {
  try {
    const data = { ...req.body };
    if (data.presupuesto) data.presupuesto = Number(data.presupuesto);
    if (data.clienteId) data.clienteId = Number(data.clienteId);
    
    const actualizado = await eventosService.actualizar(req.params.id, data);
    
    if (!actualizado) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento', detalle: error.message });
  }
}

// Eliminar evento (API)
async function removeEvento(req, res) {
  try {
    const eliminado = await eventosService.eliminar(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json({ ok: true, mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento', detalle: error.message });
  }
}

// Obtener evento con cliente incluido (API especial)
async function getEventoWithCliente(req, res) {
  try {
    const evento = await eventosService.obtenerConCliente(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evento completo', detalle: error.message });
  }
}

// ========== CONTROLADORES WEB (VISTAS PUG) ==========

// Listar todos los eventos (Vista)
async function listarEventos(req, res) {
  try {
    const eventosConCliente = await eventosService.obtenerTodosConClientes();
    const clientes = await clientesService.obtenerTodos();

    res.render('eventos', { eventos: eventosConCliente, clientes });
  } catch (error) {
    res.status(500).send('Error al cargar eventos');
  }
}

// Crear nuevo evento desde formulario web
async function crearEventoWeb(req, res) {
  try {
    const { nombre, fecha, lugar, presupuesto, estado, clienteId } = req.body;
    
    await eventosService.crear({ nombre, fecha, lugar, presupuesto, estado, clienteId });
    res.redirect('/eventos');
  } catch (error) {
    res.status(500).send('Error al crear evento');
  }
}

// Mostrar formulario de edición
async function mostrarFormularioEdicion(req, res) {
  try {
    const evento = await eventosService.buscarPorId(req.params.id);
    
    if (!evento) {
      return res.status(404).send("Evento no encontrado");
    }

    const clientes = await clientesService.obtenerTodos();
    res.render('editarEvento', { evento, clientes });
  } catch (error) {
    res.status(500).send('Error al cargar formulario de edición');
  }
}

// Guardar cambios desde formulario
async function guardarEdicionWeb(req, res) {
  try {
    const data = { ...req.body };
    if (data.presupuesto) data.presupuesto = Number(data.presupuesto);
    if (data.clienteId) data.clienteId = Number(data.clienteId);
    
    await eventosService.actualizar(req.params.id, data);
    res.redirect('/eventos');
  } catch (error) {
    res.status(500).send('Error al guardar cambios');
  }
}

// ========== FUNCIONES AUXILIARES (PARA OTROS CONTROLADORES) ==========

async function getAllData() {
  return await eventosService.obtenerTodos();
}

async function getById(id) {
  return await eventosService.buscarPorId(id);
}

async function getByIdWithCliente(id) {
  return await eventosService.obtenerConCliente(id);
}

module.exports = { 
  // Controladores API
  getAllEventos,
  getEventoById,
  createEvento,
  updateEvento,
  removeEvento,
  getEventoWithCliente,
  // Controladores Web
  listarEventos,
  crearEventoWeb,
  mostrarFormularioEdicion,
  guardarEdicionWeb,
  // Funciones auxiliares
  getAllData,
  getById,
  getByIdWithCliente
};
