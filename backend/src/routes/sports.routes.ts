import { Router } from 'express';
import SportsController from '../controllers/sports.controller';

const router = Router();

router.get('/matches', SportsController.getUpcomingMatches);

export default router;
