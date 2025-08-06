// Rotas de autenticação
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - Registrar usuário
router.post('/register', register);

// POST /api/auth/login - Login do usuário
router.post('/login', login);

export default router;