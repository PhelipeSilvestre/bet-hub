import express from 'express';
import { env } from './config/env';
import routes from './routes';
import sportsRoutes from './routes/sports.routes';
import betRoutes from './routes/bet.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

export const app = express();

// Middleware para parsear o body da requisição
app.use(express.json());

// Rotas
app.use('/api', routes);
app.use('/api/sports', sportsRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Inicializa o servidor
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
