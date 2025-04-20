/**
 * Arquivo de entrada da aplicação backend
 * Importa o servidor definido em server.ts e inicia a aplicação
 */

import express from 'express';
import cors from 'cors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Server } from 'http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from './config/env';

const app = express();
app.use(express.json());
app.use(cors());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

// Definir porta a ser usada
const PORT = 3005;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Servidor iniciado em http://localhost:${PORT + 1}`);
    });
  } else {
    console.error('Error starting server:', err);
  }
});

// Tratamento para encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});
