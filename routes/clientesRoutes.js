import { Router } from 'express';
import { getAllClientes, getClienteById, createCliente, deleteCliente } from "../controllers/clientesController.js";

const router = Router();

router.get('/', getAllClientes);
router.get('/:id', getClienteById);
router.post('/', createCliente);
router.delete('/:id', deleteCliente);

export default router;

