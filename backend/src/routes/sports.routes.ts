import { Router } from 'express';
import SportsController from '../controllers/sports.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/', SportsController.getAllSports);
router.get('/upcoming', SportsController.getUpcomingMatches);
router.get('/:sportKey/events', SportsController.getEventsForSport);
router.get('/:sportKey/events/:eventId', SportsController.getEvent);
router.get('/:sportKey/events/:eventId/best-odds', SportsController.getBestOddsForEvent);

// Rotas protegidas (apenas admin)
router.post('/update-odds', authenticate, SportsController.triggerOddsUpdate);

export default router;
