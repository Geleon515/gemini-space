import { PLAYER_SPEED, PLAYER_HP, BULLET_SPEED, FIRE_COOLDOWN, COLORS } from '../utilidades/constants.js';
import createBullet from './bullet.js';

/**
 * Crea el objeto del jugador en la escena del juego.
 * @param {object} k - El contexto de Kaboom.
 * @returns {object} - El objeto del jugador.
 */
export default function createPlayer(k) {
    const { pos, sprite, area, health, state, onUpdate, onKeyDown, onKeyPress, onCollide, add, vec2, play } = k;

    let lastFireTime = 0; 

    const player = add([
        pos(k.width() / 2, k.height() - 40), 
        k.rect(32, 16, { color: k.color(COLORS.GREEN) }),
        area(),
        k.anchor('center'),
        health(PLAYER_HP),
        {
            speed: PLAYER_SPEED,
            score: 0,
        },
        'player',
    ]);

    // --- Movimiento del Jugador ---
    onKeyDown('left', () => {
        if (player.pos.x > 20) {
            player.move(-player.speed, 0);
        }
    });
    onKeyDown('right', () => {
        if (player.pos.x < k.width() - 20) {
            player.move(player.speed, 0);
        }
    });
    onKeyDown('a', () => {
        if (player.pos.x > 20) {
            player.move(-player.speed, 0);
        }
    });
    onKeyDown('d', () => {
        if (player.pos.x < k.width() - 20) {
            player.move(player.speed, 0);
        }
    });

    // --- Disparo del Jugador ---
    function fire() {
        const currentTime = k.time();
        if (currentTime - lastFireTime >= FIRE_COOLDOWN) {
            lastFireTime = currentTime;
            
            // --- ESTA ES LA LÍNEA CORREGIDA ---
            // Pasamos k.UP (dirección) y BULLET_SPEED (velocidad)
            createBullet(k, player.pos.sub(0, 10), k.UP, BULLET_SPEED, 'player-bullet');
        }
    }

    onKeyPress('space', fire);
    onKeyDown('space', fire);  

    // --- Colisiones y Vidas ---
    player.onCollide('enemy-bullet', (bullet) => {
        bullet.destroy(); 
        player.hurt(1); 
        k.shake(10);
    });

    player.on('death', () => {
        player.destroy();
        k.go('gameOver', { score: player.score });
    });

    return player;
}