import { Router } from 'express';
import { getAllEventos, getEventoById, createEvento, deleteEvento } from "../controllers/eventosController.js";

const router = Router();

router.get('/', getAllEventos);
router.get('/:id', getEventoById);
router.post('/', createEvento);
router.delete('/:id', deleteEvento);

export default router;

