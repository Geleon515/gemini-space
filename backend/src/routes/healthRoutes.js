import express from 'express';

const router = express.Router();

// Ruta de Health Check [cite: 31]
// GET /api/health
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Servidor saludable' });
});

export default router;