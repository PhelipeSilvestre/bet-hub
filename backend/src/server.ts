import express from 'express';
import { env } from './config/env';

const app = express();

// Middleware para parsear o body da requisição
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Bet-Hub API está rodando!');
});

// Inicializa o servidor
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
