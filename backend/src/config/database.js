import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'space_invaders_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Creamos un "pool" de conexiones
// Un pool es más eficiente que crear una conexión nueva por cada consulta
const pool = mysql.createPool(dbConfig);

// Función simple para probar la conexión
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Base de Datos conectada exitosamente (ID:', connection.threadId + ')');
        connection.release(); // Devolvemos la conexión al pool
    } catch (error) {
        console.error('Error al conectar con la Base de Datos:', error.message);
        process.exit(1); // Detiene la aplicación si no puede conectar
    }
}

// Exportamos el pool para usarlo en los servicios
export default pool;