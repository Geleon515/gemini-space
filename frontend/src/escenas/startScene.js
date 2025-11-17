import { COLORS } from '../utilidades/constants.js';

/**
 * Crea la escena de inicio (pantalla de bienvenida).
 * @param {object} k - El contexto de Kaboom.
 */
export default function createStartScene(k) {
    // Asegúrate que 'kstate' esté aquí
    const { scene, add, text, color, onKeyPress, go, state: kstate } = k;

    scene('start', () => {
        // Estilo retro verde/negro
        k.setBackground(k.color(COLORS.BLACK)); 

        add([
            // Asegúrate que esta línea use 'kstate.playerName'
            text(`Bienvenido, ${kstate.playerName}!`, {
                size: 32,
                font: 'courier',
            }),
            color(COLORS.GREEN),
            k.anchor('center'), // Asegúrate que aquí diga 'k.anchor'
            k.pos(k.width() / 2, k.height() / 2 - 40),
        ]);

        add([
            text('Presiona ESPACIO para comenzar', {
                size: 24,
                font: 'courier',
            }),
            color(COLORS.WHITE),
            k.anchor('center'), // Y aquí también
            k.pos(k.width() / 2, k.height() / 2 + 20),
        ]);

        // Espera a que se presione la tecla "espacio" para ir a la escena "game"
        onKeyPress('space', () => {
            go('game'); // Inicia la escena principal del juego
        });
    });
}