import { Request, Response } from 'express';
import SportsController from '../sports.controller';
import SportsService from '../../services/sports.service';
import OddsUpdaterService from '../../services/odds-updater.service';

// Mock do SportsService
jest.mock('../../services/sports.service');

// Mock do OddsUpdaterService
jest.mock('../../services/odds-updater.service');

describe('SportsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock, send: sendMock }));
    mockRequest = {
      params: {},
      query: {},
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
    jest.clearAllMocks();
  });

  describe('getAllSports', () => {
    it('should return a list of all sports', async () => {
      const mockSports = [
        { key: 'soccer', title: 'Soccer' },
        { key: 'basketball', title: 'Basketball' }
      ];
      
      (SportsService.getAllSports as jest.Mock).mockResolvedValue(mockSports);

      await SportsController.getAllSports(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getAllSports).toHaveBeenCalledWith('us');
      expect(jsonMock).toHaveBeenCalledWith(mockSports);
    });

    it('should use the region from query params if provided', async () => {
      mockRequest.query = { region: 'eu' };
      const mockSports = [{ key: 'soccer' }]; // Adicionar um valor de retorno
      
      (SportsService.getAllSports as jest.Mock).mockResolvedValue(mockSports);
      
      await SportsController.getAllSports(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getAllSports).toHaveBeenCalledWith('eu');
      expect(jsonMock).toHaveBeenCalledWith(mockSports);
    });

    it('should handle errors and return 500', async () => {
      (SportsService.getAllSports as jest.Mock).mockRejectedValue(new Error('API Error'));

      await SportsController.getAllSports(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'API Error' });
    });
  });

  describe('getEventsForSport', () => {
    it('should return events for a specific sport', async () => {
      const mockEvents = [
        { id: 'event1', homeTeam: 'Team A', awayTeam: 'Team B' }
      ];
      
      mockRequest.params = { sportKey: 'soccer' };
      (SportsService.getEventsWithOdds as jest.Mock).mockResolvedValue(mockEvents);

      await SportsController.getEventsForSport(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getEventsWithOdds).toHaveBeenCalledWith('soccer', 'us', 'h2h');
      expect(jsonMock).toHaveBeenCalledWith(mockEvents);
    });
  });

  describe('getEvent', () => {
    it('should return a specific event', async () => {
      const mockEvent = { id: 'event1', homeTeam: 'Team A', awayTeam: 'Team B' };
      
      mockRequest.params = { sportKey: 'soccer', eventId: 'event1' };
      (SportsService.getEvent as jest.Mock).mockResolvedValue(mockEvent);

      await SportsController.getEvent(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getEvent).toHaveBeenCalledWith('soccer', 'event1', 'us', 'h2h');
      expect(jsonMock).toHaveBeenCalledWith(mockEvent);
      expect(statusMock).not.toHaveBeenCalled(); // Não deve chamar status se sucesso
    });

    it('should return 404 if event is not found', async () => {
      mockRequest.params = { sportKey: 'soccer', eventId: 'nonexistent' };
      (SportsService.getEvent as jest.Mock).mockResolvedValue(null);

      await SportsController.getEvent(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Evento não encontrado' });
      expect(jsonMock).toHaveBeenCalledTimes(1); // Deve chamar json apenas uma vez
    });
  });

  describe('getBestOddsForEvent', () => {
    it('should return the best odds for an event', async () => {
      const mockOdds = {
        eventId: 'event1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        bestOdds: {
          'Team A': { price: 2.1, bookmaker: 'Bookmaker 1' },
          'Team B': { price: 3.0, bookmaker: 'Bookmaker 2' }
        }
      };
      
      mockRequest.params = { sportKey: 'soccer', eventId: 'event1' };
      (SportsService.getBestOddsForEvent as jest.Mock).mockResolvedValue(mockOdds);

      await SportsController.getBestOddsForEvent(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getBestOddsForEvent).toHaveBeenCalledWith('soccer', 'event1', 'us', 'h2h');
      expect(jsonMock).toHaveBeenCalledWith(mockOdds);
    });
  });

  describe('triggerOddsUpdate', () => {
    it('should trigger a manual update of odds', async () => {
      (OddsUpdaterService.updateAllOdds as jest.Mock).mockResolvedValue(undefined);

      await SportsController.triggerOddsUpdate(mockRequest as Request, mockResponse as Response);

      expect(OddsUpdaterService.updateAllOdds).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Atualização de odds iniciada com sucesso' });
    });
  });

  describe('getUpcomingMatches', () => {
    it('should return upcoming matches', async () => {
      const mockMatches = [
        { id: 'match1', homeTeam: 'Team A', awayTeam: 'Team B' },
        { id: 'match2', homeTeam: 'Team C', awayTeam: 'Team D' }
      ];
      
      (SportsService.getUpcomingMatches as jest.Mock).mockResolvedValue(mockMatches);

      await SportsController.getUpcomingMatches(mockRequest as Request, mockResponse as Response);

      expect(SportsService.getUpcomingMatches).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockMatches);
    });

    it('should handle errors and return 500', async () => {
      (SportsService.getUpcomingMatches as jest.Mock).mockRejectedValue(new Error('API Error'));

      await SportsController.getUpcomingMatches(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erro ao buscar partidas' });
    });
  });
});
