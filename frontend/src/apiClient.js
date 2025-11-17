// Gestor de la API del backend
import { LEADERBOARD_LIMIT } from './utilidades/constants.js';
// La URL base del backend (corriendo en el puerto 4000 [cite: 28])
const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Envía un nuevo puntaje al backend.
 * @param {string} playerName - Nombre del jugador.
 * @param {number} score - Puntaje obtenido.
 * @returns {Promise<object>} - La respuesta del servidor.
 */
export async function postScore(playerName, score) {
    try {
        const response = await fetch(`${API_BASE_URL}/scores`, { // Ruta POST /api/scores [cite: 29]
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, score }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al enviar el puntaje:', error);
        // Devuelve un error que el juego pueda manejar
        return { error: 'No se pudo conectar al servidor' };
    }
}

/**
 * Obtiene el leaderboard (Top 10) desde el backend.
 * @returns {Promise<Array<object>>} - Una lista de puntajes.
 */
export async function getLeaderboard() {
    try {
        // Pide el top 10, como se define en los requisitos [cite: 6, 30]
        const response = await fetch(`${API_BASE_URL}/scores?limit=${LEADERBOARD_LIMIT}`); // Ruta GET /api/scores [cite: 30]

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener el leaderboard:', error);
        // Devuelve un array vacío en caso de error
        return [];
    }
}