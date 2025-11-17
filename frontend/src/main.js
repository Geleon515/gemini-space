import kaboom from 'kaboom';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './utilidades/constants.js';

// Importar las escenas que crearemos
import createStartScene from './escenas/startScene.js';
import createGameScene from './escenas/gameScene.js';
import createGameOverScene from './escenas/gameOverScene.js';
import createLeaderboardScene from './escenas/leaderboardScene.js';

// Inicializar el contexto de Kaboom 
const k = kaboom({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    // Fijamos el canvas dentro del div 'game-container'
    root: document.getElementById('game-container'),
    background: [0, 0, 0], // Fondo negro [cite: 8]
    font: 'courier', // Fuente estilo retro
    global: true, // Importa las funciones de kaboom globalmente (ej. add(), go())
});

// Almacenamiento global simple para el nombre y puntaje
// Usaremos el almacenamiento de Kaboom para esto.
k.state = {
    playerName: 'PLAYER', // Valor por defecto
    score: 0,
};

// --- Definición de Escenas  ---

// Pasamos 'k' (el contexto de Kaboom) a cada fábrica de escenas
createStartScene(k);
createGameScene(k);
createGameOverScene(k);
createLeaderboardScene(k);

// --- Lógica de Inicio (Manejo del formulario)  ---

const playerNameInput = document.getElementById('playerName');
const startGameButton = document.getElementById('startGameButton');
const startScreenDiv = document.getElementById('start-screen');
const gameContainerDiv = document.getElementById('game-container');

// Evento para el botón de empezar
startGameButton.addEventListener('click', () => {
    // Guardar el nombre del jugador
    const name = playerNameInput.value.trim();
    if (name) {
        k.state.playerName = name;
    }

    // Ocultar el formulario y mostrar el juego
    startScreenDiv.style.display = 'none';
    gameContainerDiv.style.display = 'block';
    
    // Iniciar la primera escena del juego
    // (Usaremos 'start' para una pantalla de "presiona para jugar" 
    // o 'game' para ir directo a la acción. Usemos 'game' por ahora)
    
    // ¡Corrección! El PDF pide una 'startScene'. 
    // La usaremos como una pantalla de bienvenida antes de la acción.
    go('start');
});

// Por defecto, Kaboom se inicia en la escena "main" si no se especifica.
// Pero nosotros controlamos el inicio con el botón.