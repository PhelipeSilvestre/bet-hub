import { Request, Response } from 'express';
import SportsService from '../services/sports.service';
import OddsUpdaterService from '../services/odds-updater.service';

class SportsController {
  /**
   * Retorna todos os esportes disponíveis
   */
  static async getAllSports(req: Request, res: Response) {
    try {
      const region = req.query.region as string || 'us';
      const sports = await SportsService.getAllSports(region);
      res.json(sports);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar esportes' });
    }
  }

  /**
   * Retorna eventos com odds para um esporte específico
   */
  static async getEventsForSport(req: Request, res: Response) {
    try {
      const { sportKey } = req.params;
      const region = req.query.region as string || 'us';
      const markets = req.query.markets as string || 'h2h';
      
      const events = await SportsService.getEventsWithOdds(sportKey, region, markets);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar eventos' });
    }
  }

  /**
   * Retorna um evento específico com odds
   */
  static async getEvent(req: Request, res: Response): Promise<void> {
    try {
      const { sportKey, eventId } = req.params;
      const region = req.query.region as string || 'us';
      const markets = req.query.markets as string || 'h2h';
      
      const event = await SportsService.getEvent(sportKey, eventId, region, markets);
      
      if (!event) {
        res.status(404).json({ error: 'Evento não encontrado' });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar evento' });
    }
  }

  /**
   * Retorna as melhores odds para um evento
   */
  static async getBestOddsForEvent(req: Request, res: Response) {
    try {
      const { sportKey, eventId } = req.params;
      const region = req.query.region as string || 'us';
      const markets = req.query.markets as string || 'h2h';
      
      const bestOdds = await SportsService.getBestOddsForEvent(sportKey, eventId, region, markets);
      res.json(bestOdds);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar melhores odds' });
    }
  }

  /**
   * (Apenas para administradores) Inicia a atualização manual de odds
   */
  static async triggerOddsUpdate(req: Request, res: Response) {
    try {
      await OddsUpdaterService.updateAllOdds();
      res.json({ message: 'Atualização de odds iniciada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao iniciar atualização de odds' });
    }
  }

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
