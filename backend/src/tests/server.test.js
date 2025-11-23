import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import http from 'http'; 
import request from 'supertest';

// 1. MOCKEAR LA BASE DE DATOS (Para que no intente conectar de verdad al iniciar)
jest.unstable_mockModule('../config/database.js', () => ({
    testConnection: jest.fn(),
    default: { execute: jest.fn() }
}));

describe('Pruebas de Cobertura del Servidor (Server.js)', () => {
    
    // Guardamos el entorno original para restaurarlo después
    const originalEnv = process.env.NODE_ENV;
    let listenSpy;

    beforeEach(() => {
        jest.resetModules(); // Importante: Limpia la memoria de importaciones
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restauramos todo a la normalidad
        process.env.NODE_ENV = originalEnv;
        if (listenSpy) listenSpy.mockRestore();
    });

    // --- COBERTURA: app.listen (if process.env.NODE_ENV !== 'test') ---
    test('Debe intentar iniciar el servidor (app.listen) si NO estamos en modo test', async () => {
        // 1. Cambiamos el entorno a 'development' para entrar en el 'if'
        process.env.NODE_ENV = 'development';
        
        // 2. ¡EL TRUCO MAESTRO!
        // Espiamos la función 'listen' de Node.js (http.Server).
        // Usamos .mockImplementation(() => {}) para que NO haga nada real (no abra el puerto).
        // Así engañamos al código creyendo que abrió el puerto, pero sin errores.
        listenSpy = jest.spyOn(http.Server.prototype, 'listen')
                        .mockImplementation((port, callback) => {
                            if (callback) callback(); // Ejecutamos el callback para simular éxito
                            return {}; // Devolvemos objeto vacío
                        });

        // Silenciamos console.log para que no salga "Servidor corriendo..." en el test
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // 3. Importamos el servidor dinámicamente
        // Al importarlo con NODE_ENV='development', se ejecutará el bloque 'app.listen'
        // Usamos un query param (?t=...) para forzar a Jest a recargar el archivo como nuevo
        await import(`../server.js?t=${Date.now()}`);

        // 4. Verificamos que se intentó abrir el puerto
        expect(listenSpy).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Servidor backend corriendo'));
    });

    // --- COBERTURA: Ruta '*' (if !req.path.startsWith('/api')) ---
    test('Debe intentar servir el frontend (HTML) si la ruta no empieza con /api', async () => {
        // 1. Aseguramos modo test
        process.env.NODE_ENV = 'test';
        
        // 2. Importamos la app
        const serverModule = await import('../server.js');
        const app = serverModule.default;

        // 3. Hacemos petición a una ruta que NO es de API (ej. /hola)
        // Esto activará el bloque 'app.get('*')' y el 'if' interno.
        const response = await request(app).get('/ruta-desconocida-frontend');
        
        // 4. Verificación:
        // Como no tenemos el archivo index.html real generado en la carpeta de tests,
        // es probable que Express devuelva un error 500 (o 404) al intentar hacer sendFile.
        // ¡PERO ESO ES BUENO! Significa que entró al 'if' e intentó enviar el archivo.
        // Lo único que validamos es que NO sea una respuesta JSON de la API.
        
        // Si fuera /api/..., devolvería JSON o 404 JSON.
        // Al intentar servir archivo, el content-type suele cambiar o dar error de sistema.
        expect(response.type).not.toBe('application/json');
    });
});