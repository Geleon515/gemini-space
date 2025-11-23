import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// 1. DEFINIR EL MOCK DE API
jest.unstable_mockModule('../apiClient.js', () => ({
    postScore: jest.fn(),
    getLeaderboard: jest.fn(),
}));

// 2. IMPORTACIONES DINÁMICAS
const apiClient = await import('../apiClient.js');
const createGameOverScene = (await import('../escenas/gameOverScene.js')).default;
const createLeaderboardScene = (await import('../escenas/leaderboardScene.js')).default;
const createGameScene = (await import('../escenas/gameScene.js')).default;

describe('Pruebas de Integración de Escenas', () => {
    
    let mockK;

    // Función auxiliar para crear objetos de juego falsos recursivos
    // Esto permite que un objeto tenga hijos (enemyFleet.add(enemy))
    const createMockGameObject = () => ({
        text: '', 
        color: '',
        destroy: jest.fn(),
        move: jest.fn(),
        children: [],
        on: jest.fn(),
        onCollide: jest.fn(),
        score: 0,
        hurt: jest.fn(),
        hp: () => 3,
        emit: jest.fn(),
        shoot: jest.fn(), // Para el enemigo
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        // El objeto también tiene un método .add que devuelve otro objeto igual
        add: jest.fn(() => createMockGameObject()) 
    });

    beforeEach(() => {
        jest.clearAllMocks();

        mockK = {
            scene: jest.fn(),
            
            // Usamos la función auxiliar aquí
            add: jest.fn(() => createMockGameObject()),
            
            // Resto de funciones del motor
            text: jest.fn(),
            color: jest.fn(),
            pos: jest.fn(),
            anchor: jest.fn(),
            rect: jest.fn(),
            area: jest.fn(),
            health: jest.fn(),
            sprite: jest.fn(),
            
            keyPress: jest.fn(),
            onKeyPress: jest.fn(),
            onKeyDown: jest.fn(),
            onUpdate: jest.fn(),
            onCollide: jest.fn(),
            on: jest.fn(),
            
            go: jest.fn(),
            setBackground: jest.fn(),
            width: () => 640,
            height: () => 480,
            
            rand: jest.fn(),
            choose: jest.fn(),
            loop: jest.fn(),
            destroy: jest.fn(),
            vec2: (x, y) => ({ x, y }),
            play: jest.fn(),
            shake: jest.fn(),

            state: {
                playerName: 'TEST_PLAYER'
            }
        };
    });

    // --- PRUEBA PARA GAME OVER SCENE ---
    test('gameOverScene debe intentar enviar el puntaje al backend', async () => {
        apiClient.postScore.mockResolvedValue({ ok: true });
        createGameOverScene(mockK);
        expect(mockK.scene).toHaveBeenCalledWith('gameOver', expect.any(Function));
        const sceneCallback = mockK.scene.mock.calls.find(c => c[0] === 'gameOver')[1];
        await sceneCallback({ score: 500 });
        expect(apiClient.postScore).toHaveBeenCalledWith('TEST_PLAYER', 500);
    });

    // --- PRUEBA PARA LEADERBOARD SCENE ---
    test('leaderboardScene debe intentar obtener los puntajes del backend', async () => {
        apiClient.getLeaderboard.mockResolvedValue([]);
        createLeaderboardScene(mockK);
        expect(mockK.scene).toHaveBeenCalledWith('leaderboard', expect.any(Function));
        const sceneCallback = mockK.scene.mock.calls.find(c => c[0] === 'leaderboard')[1];
        await sceneCallback();
        expect(apiClient.getLeaderboard).toHaveBeenCalled();
    });

    // --- PRUEBA PARA GAME SCENE ---
    test('gameScene debe inicializar elementos del juego (jugador, flota, UI)', async () => {
        createGameScene(mockK);
        expect(mockK.scene).toHaveBeenCalledWith('game', expect.any(Function));
        
        const sceneCallback = mockK.scene.mock.calls.find(c => c[0] === 'game')[1];
        await sceneCallback();

        expect(mockK.add).toHaveBeenCalled();
        expect(mockK.setBackground).toHaveBeenCalled();
        expect(mockK.loop).toHaveBeenCalled();
        expect(mockK.onKeyDown).toHaveBeenCalled();
    });
});