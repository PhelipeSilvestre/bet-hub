import { Router } from 'express';
import BetController from '../controllers/bet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Proteger todas as rotas de apostas
router.use(authenticate);

// Rotas existentes agora protegidas por autenticação
router.post('/', BetController.createBet);
router.get('/user/:userId', BetController.getBetsByUser);
router.get('/:id', BetController.getBetById);
router.patch('/:id/status', BetController.updateBetStatus);
router.delete('/:id', BetController.deleteBet);

export default router;
