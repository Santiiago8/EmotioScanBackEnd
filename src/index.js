// src/index.js
import express from 'express';
import sentimentRoutes from './routes/sentimentRoutes.js';
import cors from 'cors';

const app = express();
// Middleware para permitir peticiones del front
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configurar rutas
app.use('/api', sentimentRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});