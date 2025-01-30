import { Router } from 'express';
import HealthController from '../controllers/health.controller';

const router = Router();

// Rota de verificação de status da API
router.get('/', HealthController.checkStatus);

export default router;
