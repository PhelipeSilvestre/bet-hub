import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

//Definição de rotas
router.use('/health', healthRoutes);

export default router;
