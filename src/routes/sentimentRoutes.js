// src/routes/sentimentRoutes.js
import express from 'express';
import { analyzeSentiment } from '../controllers/sentimentController.js';

const router = express.Router();

// Definir ruta para análisis de sentimiento
router.post('/analyze-sentiment', analyzeSentiment);

export default router;