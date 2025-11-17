import { getLeaderboard } from '../apiClient.js';
import { COLORS, LEADERBOARD_LIMIT } from '../utilidades/constants.js';
import { formatScore, formatPlayerName } from '../utilidades/helpers.js';

/**
 * Crea la escena del Leaderboard (Tabla de puntuaciones).
 * @param {object} k - El contexto de Kaboom.
 */
export default function createLeaderboardScene(k) {
    const { scene, add, text, color, pos, anchor, onKeyPress, go } = k;

    scene('leaderboard', () => {
        k.setBackground(k.color(COLORS.BLACK));

        // Título de la escena
        add([
            text('TOP 10 - LEADERBOARD', { size: 36, font: 'courier' }),
            color(COLORS.GREEN),
            pos(k.width() / 2, 60),
            anchor('center'),
        ]);

        // Texto de carga mientras se obtienen los datos
        const loadingText = add([
            text('Cargando...', { size: 24, font: 'courier' }),
            color(COLORS.GRAY),
            pos(k.width() / 2, k.height() / 2),
            anchor('center'),
        ]);

        // --- Lógica de Carga de Puntuaciones ---
        (async () => {
            const scores = await getLeaderboard();
            loadingText.destroy(); // Elimina el texto de "Cargando..."

            if (scores.length === 0) {
                // Mensaje si no hay puntuaciones
                add([
                    text('No hay puntajes guardados.', { size: 24, font: 'courier' }),
                    color(COLORS.WHITE),
                    pos(k.width() / 2, k.height() / 2),
                    anchor('center'),
                ]);
            } else {
                // Mostrar las puntuaciones
                let yPos = 120;
                scores.forEach((entry, index) => {
                    const rank = `${index + 1}.`.padEnd(3, ' ');
                    const name = formatPlayerName(entry.playerName);
                    const score = formatScore(entry.score);

                    const entryText = `${rank} ${name} ${score}`;

                    add([
                        text(entryText, { size: 20, font: 'courier' }),
                        color(COLORS.WHITE),
                        pos(k.width() / 2, yPos),
                        anchor('center'),
                    ]);
                    yPos += 25; // Espacio entre líneas
                });
            }

            // Mostrar opción de salida
            add([
                text('Presiona ESPACIO para volver', { size: 20, font: 'courier' }),
                color(COLORS.GREEN),
                pos(k.width() / 2, k.height() - 40),
                anchor('center'),
            ]);
        })();

        // --- Controles de la escena ---
        onKeyPress('space', () => {
            // Vuelve a la pantalla de Game Over (o al inicio, si prefieres)
            // Volver a 'gameOver' es confuso si no hay puntaje.
            // Vayamos mejor a la escena 'start'.
            go('start');
        });
    });
}