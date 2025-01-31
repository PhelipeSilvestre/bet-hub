import { Request, Response } from 'express';
import SportsService from '../services/sports.service';

class SportsController {
  static async getUpcomingMatches(req: Request, res: Response) {
    try {
      const matches = await SportsService.getUpcomingMatches();
      res.json(matches);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar partidas' });
    }
  }
}

export default SportsController;
