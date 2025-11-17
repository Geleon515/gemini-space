import * as scoreService from '../services/scoreService.js';

/**
 * Manejador para POST /api/scores
 * Recibe un puntaje y lo guarda.
 */
export async function handleAddScore(req, res) {
    try {
        const { playerName, score } = req.body;

        // --- Validación de Entrada ---
        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({ error: 'El nombre del jugador (playerName) es obligatorio.' });
        }
        if (score === undefined || typeof score !== 'number' || score < 0) {
            return res.status(400).json({ error: 'El puntaje (score) debe ser un número positivo.' });
        }

        // Llamamos al servicio para crear el puntaje
        const newScore = await scoreService.createScore(playerName.trim(), score);
        
        // Respondemos con 201 (Created)
        res.status(201).json(newScore);

    } catch (error) {
        // Error interno del servidor
        res.status(500).json({ error: 'Error interno del servidor al guardar el puntaje.' });
    }
}

/**
 * Manejador para GET /api/scores
 * Devuelve el leaderboard (Top 10 por defecto).
 */
export async function handleGetScores(req, res) {
    try {
        // Obtenemos el límite de la query string, default 10 [cite: 30]
        const limit = parseInt(req.query.limit) || 10;
        
        // Llamamos al servicio para obtener los puntajes
        const scores = await scoreService.getScores(limit);
        
        // Respondemos con 200 (OK)
        res.status(200).json(scores);

    } catch (error) {
        // Error interno del servidor
        res.status(500).json({ error: 'Error interno del servidor al obtener los puntajes.' });
    }
}