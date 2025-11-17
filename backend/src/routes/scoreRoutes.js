import express from 'express';
// Importamos los manejadores desde el controlador
import { handleAddScore, handleGetScores } from '../controllers/scoreController.js';

const router = express.Router();

// Ruta para crear un nuevo puntaje [cite: 29]
// POST /api/scores
router.post('/scores', handleAddScore);

// Ruta para obtener el leaderboard [cite: 30]
// GET /api/scores?limit=10
router.get('/scores', handleGetScores);

export default router;