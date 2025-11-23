import { formatScore, formatPlayerName } from '../utilidades/helpers.js';

describe('Pruebas de Helpers (Utilidades)', () => {
    
    test('formatScore debe rellenar con ceros a la izquierda hasta 5 dígitos', () => {
        expect(formatScore(0)).toBe('00000');
        expect(formatScore(50)).toBe('00050');
        expect(formatScore(99999)).toBe('99999');
    });

    test('formatPlayerName debe convertir a mayúsculas y rellenar espacios', () => {
        // "alex" (4 letras) + 11 espacios = 15 caracteres
        const result = formatPlayerName('alex');
        expect(result).toBe('ALEX           '); 
        expect(result.length).toBe(15);
    });

    test('formatPlayerName debe cortar nombres muy largos (si fuera el caso) o mantenerlos', () => {
        // En tu código actual solo hace padEnd, probemos un nombre exacto
        const name15 = '123456789012345';
        expect(formatPlayerName(name15)).toBe('123456789012345');
    });
});