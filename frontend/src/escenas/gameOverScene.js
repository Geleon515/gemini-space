import { postScore } from '../apiClient.js';
import { COLORS } from '../utilidades/constants.js';
import { formatScore } from '../utilidades/helpers.js';

/**
 * Crea la escena de "Game Over".
 * @param {object} k - El contexto de Kaboom.
 */
export default function createGameOverScene(k) {
    const { scene, add, text, color, pos, anchor, onKeyPress, go, state: kstate } = k;

    // 'gameOver' recibe los datos de la escena anterior (ej. el puntaje)
    scene('gameOver', ({ score }) => {
        k.setBackground(k.color(COLORS.BLACK));
        
        // Estado para saber si ya enviamos el puntaje
        let scoreSent = false;

        // Título de la pantalla
        add([
            text('GAME OVER', { size: 48, font: 'courier' }),
            color(COLORS.GREEN),
            pos(k.width() / 2, k.height() / 2 - 80),
            anchor('center'),
        ]);

        // Muestra el puntaje final
        add([
            text(`TU PUNTAJE: ${formatScore(score)}`, { size: 32, font: 'courier' }),
            color(COLORS.WHITE),
            pos(k.width() / 2, k.height() / 2),
            anchor('center'),
        ]);

        // --- Lógica de envío de puntaje ---
        const statusText = add([
            text('Enviando puntaje...', { size: 20, font: 'courier' }),
            color(COLORS.GRAY),
            pos(k.width() / 2, k.height() / 2 + 40),
            anchor('center'),
        ]);

        // Usamos una función asíncrona autoejecutable para enviar el puntaje
        (async () => {
            if (scoreSent) return; // Evita envíos duplicados
            scoreSent = true;
            
            // Envía el puntaje al backend
            const result = await postScore(kstate.playerName, score);

            if (result && !result.error) {
                statusText.text = 'Puntaje guardado!';
                statusText.color = k.color(COLORS.GREEN);
            } else {
                statusText.text = 'Error al guardar puntaje';
                statusText.color = k.color(COLORS.WHITE); // O un rojo si lo prefieres
            }

            // Una vez enviado (o fallido), muestra las opciones de reinicio
            showRestartOptions();
        })();


        // --- Opciones de Reinicio (se muestran después de enviar el puntaje) ---
        function showRestartOptions() {
            add([
                text('Presiona ESPACIO para reintentar', { size: 20, font: 'courier' }),
                color(COLORS.WHITE),
                pos(k.width() / 2, k.height() / 2 + 100),
                anchor('center'),
            ]);

            add([
                text('Presiona L para ver el Leaderboard', { size: 20, font: 'courier' }),
                color(COLORS.WHITE),
                pos(k.width() / 2, k.height() / 2 + 130),
                anchor('center'),
            ]);
        }

        // --- Controles de la escena ---
        onKeyPress('space', () => {
            // Reinicia el juego volviendo a la escena 'game'
            go('game');
        });

        onKeyPress('l', () => {
            // Va a la escena del leaderboard
            go('leaderboard');
        });
    });
}