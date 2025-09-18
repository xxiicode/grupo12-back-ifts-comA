import { readData, writeData } from "../models/db.js";

const getAllClientes = (req, res) => {
  const data = readData();
  res.json(data.clientes);
};

const getClienteById = (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id)
  const cliente = data.clientes.find(c => c.id === id); 
    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ error: 'Cliente no encontrado' });
    }   
};

const createCliente = (req, res) => {
  const { nombre, email, telefono } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'nombre y email son requeridos' });
  }

  const data = readData();

  const nuevo = {
    id: data.clientes.length + 1,
    nombre,
    email,
    telefono: telefono || ''
  };

  data.clientes.push(nuevo);
  writeData(data);

  res.status(201).json(nuevo);
};

const deleteCliente = (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  const idx = data.clientes.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  const [eliminado] = data.clientes.splice(idx, 1);
  writeData(data);
  res.status(200).json(eliminado);
};


export { getAllClientes, getClienteById, createCliente, deleteCliente }; 