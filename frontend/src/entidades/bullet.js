import { COLORS } from '../utilidades/constants.js';

/**
 * Crea una bala en la escena.
 * @param {object} k - El contexto de Kaboom.
 * @param {object} p - La posición inicial (vec2).
 * @param {object} direction - El vector de dirección (ej. k.UP o k.DOWN).
 * @param {number} speed - La velocidad (siempre positiva).
 * @param {string} tag - La etiqueta de la bala.
 */
export default function createBullet(k, p, direction, speed, tag) {
    const { add, pos, rect, color, area, anchor, move, offscreen, destroy } = k;

    add([
        pos(p),
        rect(4, 12, { color: k.color(COLORS.WHITE) }),
        area(),
        anchor('center'),
        
        // --- ESTA ES LA LÍNEA CORREGIDA ---
        // Usamos la forma no ambigua: move(direction, speed)
        move(direction, speed),
        // ----------------------------------

        offscreen({ destroy: true }), 
        tag,
    ]);
}