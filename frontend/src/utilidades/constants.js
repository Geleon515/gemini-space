// Constantes del juego para fácil modificación

// Dimensiones del lienzo
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 480;

// Configuración del jugador
export const PLAYER_SPEED = 200;
export const PLAYER_HP = 3; // Vidas del jugador 

// Configuración de enemigos
export const ENEMY_SPEED = 50;
export const ENEMY_ROWS = 4; // Filas de enemigos 
export const ENEMY_COLS = 8; // Columnas de enemigos 
export const ENEMY_SPACING_X = 60;
export const ENEMY_SPACING_Y = 40;
export const ENEMY_HP = 1;

// Configuración de balas
export const BULLET_SPEED = 300;
export const ENEMY_BULLET_SPEED = 250;
export const FIRE_COOLDOWN = 0.5; // Medio segundo de espera entre disparos
export const ENEMY_FIRE_RATE = 1.5; // Cada 1.5 segundos (promedio)

// Colores estilo retro [cite: 8]
export const COLORS = {
    BLACK: '#000000',
    GREEN: '#00FF00',
    WHITE: '#FFFFFF',
    GRAY: '#808080',
};

// Configuración del Leaderboard
export const LEADERBOARD_LIMIT = 10; // Top 10