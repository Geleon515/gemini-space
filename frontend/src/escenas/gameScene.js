import createPlayer from '../entidades/player.js';
import createEnemy from '../entidades/enemy.js';
import {
    COLORS,
    ENEMY_ROWS,
    ENEMY_COLS,
    ENEMY_SPACING_X,
    ENEMY_SPACING_Y,
    ENEMY_SPEED,
    ENEMY_FIRE_RATE,
} from '../utilidades/constants.js';
import { formatScore } from '../utilidades/helpers.js';

/**
 * Crea la escena principal del juego.
 * @param {object} k - El contexto de Kaboom.
 */
export default function createGameScene(k) {
    const {
        scene,
        add,
        text,
        color,
        pos,
        go,
        loop,
        rand,
        choose, // <<< 1. AGREGAMOS 'choose' AQUÍ
        onUpdate,
        on,
        destroy,
        state: kstate,
    } = k;

    scene('game', () => {
        k.setBackground(k.color(COLORS.BLACK));

        // --- Estado de la Escena ---
        let score = 0;
        let lives = 3;
        let currentEnemySpeed = ENEMY_SPEED;
        let enemyMoveDirection = 1;

        // --- Interfaz de Usuario (UI) ---
        const scoreText = add([
            text(`SCORE: ${formatScore(score)}`, { size: 20, font: 'courier' }),
            pos(20, 10),
            color(COLORS.GREEN),
            { value: score },
        ]);

        const livesText = add([
            text(`LIVES: ${lives}`, { size: 20, font: 'courier' }),
            pos(k.width() - 120, 10),
            color(COLORS.GREEN),
            { value: lives },
        ]);

        // --- Creación del Jugador ---
        const player = createPlayer(k);
        player.score = score;

        // --- Creación de la Flota Enemiga ---
        const enemyFleet = add([
            pos(ENEMY_SPACING_X, 80),
            'enemy-fleet',
        ]);

        // --- Lógica de Creación de Enemigos ---
        for (let row = 0; row < ENEMY_ROWS; row++) {
            for (let col = 0; col < ENEMY_COLS; col++) {
                const x = col * ENEMY_SPACING_X;
                const y = row * ENEMY_SPACING_Y;
                
                const enemyComponents = createEnemy(k, k.vec2(x, y));
                const enemy = enemyFleet.add(enemyComponents);

                enemy.onCollide('player-bullet', (bullet) => {
                    bullet.destroy();
                    enemy.hurt(1);
                });

                enemy.on('death', () => {
                    // 1. Emite el evento primero (para efectos visuales si los hubiera)
                    // (Nota: Como simplificamos la lógica en el paso anterior, 
                    //  la lógica principal está aquí abajo, no en un 'emit' externo)
                    
                    // 2. Sumamos el puntaje y actualizamos la UI
                    score += 100;
                    scoreText.text = `SCORE: ${formatScore(score)}`;
                    player.score = score;

                    // 3. Comprobamos victoria
                    // (Restamos 1 porque este enemigo aún cuenta en .children hasta que se destruye)
                    if (enemyFleet.children.length - 1 <= 0) {
                        go('gameOver', { score: score });
                    }

                    // 4. Finalmente destruimos al enemigo
                    destroy(enemy);
                });
            }
        }

        // --- Lógica de Movimiento Enemigo ---
        onUpdate('enemy-fleet', (fleet) => {
            fleet.move(currentEnemySpeed * enemyMoveDirection, 0);

            let changeDirection = false;
            for (const enemy of fleet.children) {
                if (
                    (enemy.pos.x + fleet.pos.x > k.width() - 20) ||
                    (enemy.pos.x + fleet.pos.x < 20)
                ) {
                    changeDirection = true;
                    break;
                }
            }

            if (changeDirection) {
                enemyMoveDirection *= -1;
                fleet.pos.y += 20;
            }
        });

        // --- Lógica de Disparo Enemigo ---
        loop(ENEMY_FIRE_RATE, () => {
            if (enemyFleet.children.length === 0) return;

            // <<< 2. CORRECCIÓN PRINCIPAL: Usamos 'choose' en lugar de 'rand'
            const randomEnemy = choose(enemyFleet.children);
            
            if (randomEnemy && randomEnemy.shoot) {
                randomEnemy.shoot();
            }
        });

        // --- Lógica de Colisiones y Eventos ---

        player.on('hurt', () => {
            lives = player.hp();
            livesText.text = `LIVES: ${lives}`;
        });

        onUpdate('enemy', (enemy) => {
            if (enemy.pos.y + enemyFleet.pos.y > k.height() - 60) {
                player.destroy();
                go('gameOver', { score: score });
            }
        });

        player.onCollide('enemy', (enemy) => {
            player.destroy();
            enemy.destroy();
            go('gameOver', { score: score });
        });
    });
}