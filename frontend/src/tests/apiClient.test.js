// Importamos todo lo necesario explícitamente
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { postScore, getLeaderboard } from '../apiClient.js';

// Simulamos la constante global fetch
global.fetch = jest.fn();

describe('Pruebas de API Client', () => {

    beforeEach(() => {
        fetch.mockClear(); 
    });

    test('postScore debe hacer una petición POST correcta', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' }),
        });

        const playerName = 'TEST_PLAYER';
        const score = 100;

        await postScore(playerName, score);

        // Aquí SÍ esperamos 2 argumentos porque POST lleva configuración
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/scores'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName, score }),
            })
        );
    });

    test('getLeaderboard debe hacer una petición GET correcta', async () => {
        const mockData = [{ playerName: 'A', score: 100 }];
        
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const data = await getLeaderboard();

        // --- CORRECCIÓN AQUÍ ---
        // Quitamos 'expect.anything()' porque fetch se llamó solo con la URL
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/scores?limit=')
        );
        
        expect(data).toEqual(mockData);
    });

    test('getLeaderboard debe manejar errores y devolver array vacío', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const data = await getLeaderboard();

        expect(data).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});