import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';

// 1. MOCKEAR LA BASE DE DATOS
jest.unstable_mockModule('../config/database.js', () => ({
    default: {
        execute: jest.fn(), 
    },
    testConnection: jest.fn(), 
}));

// 2. IMPORTACIONES DINÁMICAS
const app = (await import('../server.js')).default;
const dbInfo = await import('../config/database.js');
const mockPool = dbInfo.default;

describe('Pruebas de API Backend (Scores)', () => {

    // Variable para espiar y silenciar errores de consola
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        // Silenciamos console.error para que el test no se vea "rojo" en la terminal
        // cuando probamos los errores 500
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restauramos la consola original después de cada test
        consoleErrorSpy.mockRestore();
    });

    // --- PRUEBA: GET /api/health ---
    test('GET /api/health debe responder estado 200', async () => {
        const response = await request(app).get('/api/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'UP', message: 'Servidor saludable' });
    });

    // --- PRUEBA: GET /api/scores (Happy Path) ---
    test('GET /api/scores debe devolver una lista de puntajes', async () => {
        const mockRows = [
            { playerName: 'JUGADOR 1', score: 1000 },
            { playerName: 'JUGADOR 2', score: 500 }
        ];
        mockPool.execute.mockResolvedValue([mockRows, undefined]);

        const response = await request(app).get('/api/scores');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
        expect(mockPool.execute).toHaveBeenCalled();
    });

    // --- PRUEBA: POST /api/scores (Happy Path) ---
    test('POST /api/scores debe guardar un puntaje válido', async () => {
        const newScore = { playerName: 'TEST_USER', score: 150 };
        mockPool.execute.mockResolvedValue([{ insertId: 1 }, undefined]);

        const response = await request(app)
            .post('/api/scores')
            .send(newScore);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
    });

    // --- PRUEBA: POST /api/scores (Validación 400) ---
    test('POST /api/scores debe fallar si falta el nombre', async () => {
        const badScore = { score: 150 }; 
        const response = await request(app).post('/api/scores').send(badScore);
        
        expect(response.statusCode).toBe(400);
        expect(mockPool.execute).not.toHaveBeenCalled();
    });

    // ==========================================
    // NUEVOS TESTS PARA CUBRIR LOS CATCH (500)
    // ==========================================

    // --- PRUEBA: GET /api/scores (Error 500 - Catch) ---
    test('GET /api/scores debe manejar errores de BD y devolver 500', async () => {
        // Simulamos que la base de datos FALLA (lanza una excepción)
        mockPool.execute.mockRejectedValue(new Error('Conexión perdida con MySQL'));

        const response = await request(app).get('/api/scores');

        // Verificamos que el controlador capturó el error
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error interno del servidor al obtener los puntajes.');
        
        // Verificamos que se imprimió el error en consola (nuestro spy lo detectó)
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    // --- PRUEBA: POST /api/scores (Error 500 - Catch) ---
    test('POST /api/scores debe manejar errores de BD y devolver 500', async () => {
        const newScore = { playerName: 'TEST_USER', score: 150 };
        
        // Simulamos que la base de datos FALLA al insertar
        mockPool.execute.mockRejectedValue(new Error('Error de restricción SQL'));

        const response = await request(app)
            .post('/api/scores')
            .send(newScore);

        // Verificamos que el controlador capturó el error
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error interno del servidor al guardar el puntaje.');
        
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});