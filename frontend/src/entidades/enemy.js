import { ENEMY_HP, COLORS, ENEMY_BULLET_SPEED } from '../utilidades/constants.js';
import createBullet from './bullet.js';

/**
 * Define los componentes para un enemigo.
 * @param {object} k - El contexto de Kaboom.
 * @param {object} p - La posición inicial (vec2).
 * @returns {Array} - Un array de componentes de Kaboom.
 */
export default function createEnemy(k, p) {
    const { pos, rect, color, area, anchor, health } = k;

    return [
        pos(p),
        rect(24, 16, { color: k.color(COLORS.GRAY) }),
        area(),
        anchor('center'),
        health(ENEMY_HP),
        {
            // Añadimos el método 'shoot'
            shoot() {
                if (this.exists()) {
                    // --- ESTA ES LA LÍNEA CORREGIDA ---
                    // Pasamos k.DOWN (dirección) y ENEMY_BULLET_SPEED (velocidad)
                    createBullet(k, this.pos.add(0, 10), k.DOWN, ENEMY_BULLET_SPEED, 'enemy-bullet');
                }
            },
        },
        'enemy',
    ];
}