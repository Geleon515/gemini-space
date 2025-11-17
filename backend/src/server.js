import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importamos la función de prueba de conexión
import { testConnection } from './config/database.js';

// Importamos las rutas que crearemos
import scoreRoutes from './routes/scoreRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

// --- Configuración Inicial ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000; // Puerto 4000 como pide el PDF 

// Obtenemos la ruta del directorio actual (necesario con ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(express.json()); // Para parsear JSON en el body

// Configuración de CORS 
// Habilitar CORS solo para el frontend en localhost:3000
// --- ESTA ES LA CORRECCIÓN ---
const allowedOrigins = [
    'http://localhost:3000', // El que pusimos por si acaso
    'http://localhost:5173'  // El que Vite está usando ahora
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};
app.use(cors(corsOptions));

// --- Servir Archivos Estáticos del Frontend ---
// El PDF pide servir la carpeta 'frontend/' como estático 
// Vamos dos niveles arriba (src -> backend -> project) y luego a 'frontend/dist'
// (Usaremos 'frontend/dist' que es donde 'vite build' genera los archivos)
// *Corrección: El PDF dice 'frontend/', asumiremos los archivos de desarrollo.
// *Mejor práctica es servir la carpeta 'dist' del frontend.
// *Vamos a asumir que el frontend se sirve con 'vite dev' en el puerto 3000
// *y el backend solo es API.

// *Revisión del PDF*: "servir la carpeta frontend/ como estático".
// Esto es inusual si el frontend corre en Vite (puerto 3000).
// Lo implementaré como se pide, aunque lo normal es que el frontend en 3000
// solo consuma la API del 4000.
const frontendPath = path.join(__dirname, '../../../frontend');
app.use(express.static(frontendPath));

// --- Rutas de la API ---
app.use('/api', scoreRoutes); // Rutas de puntajes (/api/scores)
app.use('/api', healthRoutes); // Ruta de health check (/api/health)

// --- Ruta principal (sirve el index.html del frontend) ---
app.get('*', (req, res) => {
    // Si la petición no es de la API, sirve el frontend
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

// --- Iniciar Servidor ---
app.listen(PORT, async () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    // Probamos la conexión a la BD al iniciar
    await testConnection();
});

export default app; // Exportamos 'app' para usarlo en las pruebas (supertest)