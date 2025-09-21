import * as eventosService from '../services/eventosService.js';
import * as clientesService from '../services/clientesService.js';

// ---------- FUNCIONES API (JSON) ----------

// GET /eventos/api - Obtener todos los eventos (JSON)
export function getEventos() {
  return async (req, res) => {
    try {
      const eventos = await eventosService.getEventos();
      res.json(eventos);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  };
}

// GET /eventos/api/:id - Obtener evento por ID (JSON)
export function getEvento() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await eventosService.getEvento(id);
      
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      
      res.json(evento);
    } catch (error) {
      console.error('Error al obtener evento:', error);
      res.status(500).json({ error: 'Error al obtener evento' });
    }
  };
}

// POST /eventos/api - Crear nuevo evento (JSON)
export function createEvento() {
  return async (req, res) => {
    try {
      const nuevoEvento = await eventosService.createEvento(req.body);
      res.status(201).json(nuevoEvento);
    } catch (error) {
      console.error('Error al crear evento:', error);
      res.status(500).json({ error: 'Error al crear evento' });
    }
  };
}

// PUT /eventos/api/:id - Actualizar evento (JSON)
export function updateEvento() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const eventoActualizado = await eventosService.updateEvento(id, req.body);
      
      if (!eventoActualizado) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      
      res.json(eventoActualizado);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ error: 'Error al actualizar evento' });
    }
  };
}

// DELETE /eventos/api/:id - Eliminar evento (JSON)
export function deleteEvento() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await eventosService.deleteEvento(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      
      res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      res.status(500).json({ error: 'Error al eliminar evento' });
    }
  };
}

// GET /eventos/api/:id/full - Obtener evento con datos completos del cliente (JSON)
export function getEventoFull() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await eventosService.getEvento(id);
      
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      
      // Obtener datos del cliente si existe
      let cliente = null;
      if (evento.clienteId) {
        cliente = await clientesService.getCliente(evento.clienteId);
      }
      
      const eventoCompleto = {
        ...evento,
        cliente: cliente
      };
      
      res.json(eventoCompleto);
    } catch (error) {
      console.error('Error al obtener evento completo:', error);
      res.status(500).json({ error: 'Error al obtener evento completo' });
    }
  };
}

// ---------- FUNCIONES WEB (VISTAS PUG) ----------

// GET /eventos - Mostrar lista de eventos (Vista)
export function showEventos() {
  return async (req, res) => {
    try {
      const eventos = await eventosService.getEventos();
      const clientes = await clientesService.getClientes();
      
      // Enriquecer eventos con datos del cliente
      const eventosConClientes = eventos.map(evento => ({
        ...evento,
        cliente: clientes.find(c => c.id === evento.clienteId)
      }));
      
      res.render('eventos', {
        title: 'Lista de Eventos',
        eventos: eventosConClientes,
        clientes: clientes
      });
    } catch (error) {
      console.error('Error al mostrar eventos:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar los eventos'
      });
    }
  };
}

// POST /eventos - Crear nuevo evento (Vista)
export function createEventoWeb() {
  return async (req, res) => {
    try {
      await eventosService.createEvento(req.body);
      res.redirect('/eventos');
    } catch (error) {
      console.error('Error al crear evento:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al crear el evento'
      });
    }
  };
}

// GET /eventos/editar/:id - Mostrar formulario de edición (Vista)
export function showEditForm() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await eventosService.getEvento(id);
      const clientes = await clientesService.getClientes();
      
      if (!evento) {
        return res.status(404).render('error', {
          title: 'Error',
          message: 'Evento no encontrado'
        });
      }
      
      res.render('editarEventos', {
        title: 'Editar Evento',
        evento: evento,
        clientes: clientes
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar el formulario'
      });
    }
  };
}

// POST /eventos/editar/:id - Actualizar evento (Vista)
export function updateEventoWeb() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      await eventosService.updateEvento(id, req.body);
      res.redirect('/eventos');
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al actualizar el evento'
      });
    }
  };
}