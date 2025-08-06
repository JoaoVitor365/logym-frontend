// Rotas de academias
import express from 'express';
import { 
  getAllAcademies, 
  getAcademyById, 
  searchAcademies, 
  createAcademy 
} from '../controllers/academyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/academies - Buscar todas as academias ou com filtro
router.get('/', searchAcademies);

// GET /api/academies/:id - Buscar academia por ID
router.get('/:id', getAcademyById);

// POST /api/academies - Criar nova academia (requer autenticação)
router.post('/', authenticateToken, createAcademy);

export default router;