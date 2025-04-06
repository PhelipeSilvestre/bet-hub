import { Request, Response } from 'express';
import BetService from '../services/bet.service';

class BetController {
  static async createBet(req: Request, res: Response) {
    try {
      const { eventId, amount, odds, sport } = req.body;
      const userId = req.userId!; // Usando o userId do token
      
      const bet = await BetService.createBet(userId, eventId, amount, odds, sport);
      res.status(201).json(bet);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }

  static async getBetsByUser(req: Request, res: Response) {
    try {
      const userId = req.userId!; // Usando o userId do token
      const bets = await BetService.getBetsByUser(userId);
      res.json(bets);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }

  static async getBetById(req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      const bet = await BetService.getBetById(id);
      if (!bet) {
        res.status(404).json({ error: 'Aposta não encontrada' });
      }
      res.json(bet);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }

  static async updateBetStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const bet = await BetService.updateBetStatus(id, status);
      res.json(bet);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred'  });
    }
  }

  static async deleteBet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await BetService.deleteBet(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred'  });
    }
  }
}

export default BetController;
