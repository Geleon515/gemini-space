// Funciones de ayuda reutilizables

/**
 * Formatea un puntaje a un número de 5 dígitos con ceros a la izquierda.
 * @param {number} score - El puntaje a formatear.
 * @returns {string}
 */
export function formatScore(score) {
    return score.toString().padStart(5, '0');
}

/**
 * Formatea el nombre de un jugador para el leaderboard.
 * @param {string} name - El nombre del jugador.
 * @returns {string}
 */
export function formatPlayerName(name) {
    return name.toUpperCase().padEnd(15, ' ');
}