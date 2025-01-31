import express from 'express';
import { env } from './config/env';
import routes from './routes';
import sportsRoutes from './routes/sports.routes';

const app = express();

// Middleware para parsear o body da requisição
app.use(express.json());

// Rota de teste
app.use('/api', routes);
app.use('/api/sports', sportsRoutes);

// Inicializa o servidor
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
