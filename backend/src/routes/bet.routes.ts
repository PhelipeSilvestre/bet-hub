import { Router } from 'express';
import BetController from '../controllers/bet.controller';

const router = Router();

router.post('/', BetController.createBet);
router.get('/user/:userId', BetController.getBetsByUser);
router.get('/:id', BetController.getBetById);
router.patch('/:id/status', BetController.updateBetStatus);
router.delete('/:id', BetController.deleteBet);

export default router;
