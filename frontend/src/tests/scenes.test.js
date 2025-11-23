import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import createGameOverScene from '../escenas/gameOverScene.js';
import createLeaderboardScene from '../escenas/leaderboardScene.js';
import * as apiClient from '../apiClient.js';

// 1. Mockeamos (simulamos) el cliente de API para no llamar al backend real
jest.mock('../apiClient.js');

describe('Pruebas de Integración de Escenas', () => {
    
    // Aquí guardaremos nuestro "Kaboom Falso"
    let mockK;

    beforeEach(() => {
        // Limpiamos los mocks antes de cada test
        jest.clearAllMocks();

        // 2. Construimos un objeto 'k' falso con todas las funciones que usan tus escenas.
        // Usamos jest.fn() para poder espiar si fueron llamadas.
        mockK = {
            scene: jest.fn(),
            add: jest.fn(),
            text: jest.fn(),
            color: jest.fn(),
            pos: jest.fn(),
            anchor: jest.fn(),
            keyPress: jest.fn(), // Para versiones viejas
            onKeyPress: jest.fn(), // Para versiones nuevas
            go: jest.fn(),
            setBackground: jest.fn(),
            width: () => 640,
            height: () => 480,
            // Simulamos el estado global del jugador
            state: {
                playerName: 'TEST_PLAYER'
            }
        };
    });

    // --- PRUEBA PARA GAME OVER SCENE ---
    test('gameOverScene debe intentar enviar el puntaje al backend', async () => {
        // Configuramos el mock de postScore para que devuelva éxito
        apiClient.postScore.mockResolvedValue({ ok: true });

        // 1. Inicializamos la escena
        createGameOverScene(mockK);

        // Verificamos que se registró la escena llamada "gameOver"
        expect(mockK.scene).toHaveBeenCalledWith('gameOver', expect.any(Function));

        // 2. ¡El Truco! Obtenemos la función que definiste dentro de scene('gameOver', ...)
        // mockK.scene.mock.calls[0][1] es el segundo argumento (la función callback)
        const sceneCallback = mockK.scene.mock.calls[0][1];

        // 3. Ejecutamos esa función simulando que Kaboom arrancó la escena
        // Le pasamos un puntaje simulado de 500
        await sceneCallback({ score: 500 });

        // 4. Verificamos: ¿Se llamó a postScore con el nombre y puntaje correctos?
        expect(apiClient.postScore).toHaveBeenCalledWith('TEST_PLAYER', 500);
    });

    // --- PRUEBA PARA LEADERBOARD SCENE ---
    test('leaderboardScene debe intentar obtener los puntajes del backend', async () => {
        // Configuramos el mock para devolver una lista vacía
        apiClient.getLeaderboard.mockResolvedValue([]);

        // 1. Inicializamos la escena
        createLeaderboardScene(mockK);

        // Verificamos que se registró la escena
        expect(mockK.scene).toHaveBeenCalledWith('leaderboard', expect.any(Function));

        // 2. Obtenemos el callback de la escena
        const sceneCallback = mockK.scene.mock.calls[0][1];

        // 3. Ejecutamos la escena
        await sceneCallback();

        // 4. Verificamos: ¿Se llamó a getLeaderboard?
        expect(apiClient.getLeaderboard).toHaveBeenCalled();
    });
});