import pool from '../config/database.js';

/**
 * Guarda un nuevo puntaje en la base de datos.
 * @param {string} playerName - Nombre del jugador.
 *param {number} score - Puntaje obtenido.
 * @returns {Promise<object>} - El objeto del puntaje creado.
 */
export async function createScore(playerName, score) {
    const query = 'INSERT INTO scores (playerName, score) VALUES (?, ?)';
    try {
        const [result] = await pool.execute(query, [playerName, score]);
        return { id: result.insertId, playerName, score };
    } catch (error) {
        // Manejamos errores si la base de datos falla
        console.error("Error al insertar en la base de datos:", error.message);
        throw new Error('Error al guardar el puntaje en la BD.');
    }
}

/**
 * Obtiene la lista de puntajes más altos (leaderboard).
 * @param {number} limit - El número de puntajes a devolver.
 * @returns {Promise<Array<object>>} - Una lista de puntajes.
 */
export async function getScores(limit) {

    // 1. Nos aseguramos de que el límite sea un número (para evitar inyección SQL)
    //    Aunque el controlador ya lo hace, es bueno ser doblemente seguro.
    const safeLimit = parseInt(limit) || 10;

    // 2. ¡ESTA ES LA CORRECCIÓN!
    //    Inyectamos el número 'safeLimit' directamente en el string.
    //    No usamos 'LIMIT ?'.
    const query = `SELECT playerName, score, createdAt FROM scores ORDER BY score DESC LIMIT ${safeLimit}`;

    try {
        // 3. Ejecutamos la consulta SIN parámetros, 
        //    porque ya no hay '?' en el query.
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.error("Error al seleccionar de la base de datos:", error.message);
        throw new Error('Error al obtener los puntajes de la BD.');
    }
}