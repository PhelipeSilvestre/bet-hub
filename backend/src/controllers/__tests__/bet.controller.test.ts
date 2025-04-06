import { Request, Response } from 'express';
import BetController from '../bet.controller';
import BetService from '../../services/bet.service';

jest.mock('../../services/bet.service');

describe('BetController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe('createBet', () => {
    it('should create a bet and return 201', async () => {
      const mockBet = { id: 'bet1', userId: 'user1', amount: 50 };
      (BetService.createBet as jest.Mock).mockResolvedValue(mockBet);

      mockRequest.body = {
        userId: 'user1',
        eventId: 'event1',
        amount: 50,
        odds: 2.0,
        sport: 'football',
      };

      await BetController.createBet(mockRequest as Request, mockResponse as Response);

      expect(BetService.createBet).toHaveBeenCalledWith('user1', 'event1', 50, 2.0, 'football');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockBet);
    });

    it('should return 400 if an error occurs', async () => {
      (BetService.createBet as jest.Mock).mockRejectedValue(new Error('Usuário não encontrado'));

      mockRequest.body = {
        userId: 'user1',
        eventId: 'event1',
        amount: 50,
        odds: 2.0,
        sport: 'football',
      };

      await BetController.createBet(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });

  describe('getBetsByUser', () => {
    it('should return a list of bets for a user', async () => {
      const mockBets = [{ id: 'bet1', userId: 'user1', amount: 50 }];
      (BetService.getBetsByUser as jest.Mock).mockResolvedValue(mockBets);

      mockRequest.params = { userId: 'user1' };

      await BetController.getBetsByUser(mockRequest as Request, mockResponse as Response);

      expect(BetService.getBetsByUser).toHaveBeenCalledWith('user1');
      expect(jsonMock).toHaveBeenCalledWith(mockBets);
    });
  });

  describe('getBetById', () => {
    it('should return a bet by its ID', async () => {
      const mockBet = { id: 'bet1', userId: 'user1', amount: 50 };
      (BetService.getBetById as jest.Mock).mockResolvedValue(mockBet);

      mockRequest.params = { id: 'bet1' };

      await BetController.getBetById(mockRequest as Request, mockResponse as Response);

      expect(BetService.getBetById).toHaveBeenCalledWith('bet1');
      expect(jsonMock).toHaveBeenCalledWith(mockBet);
    });

    it('should return 404 if the bet is not found', async () => {
      (BetService.getBetById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: 'bet1' };

      await BetController.getBetById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Aposta não encontrada' });
    });
  });

  describe('updateBetStatus', () => {
    it('should update the status of a bet', async () => {
      const mockBet = { id: 'bet1', status: 'WON' };
      (BetService.updateBetStatus as jest.Mock).mockResolvedValue(mockBet);

      mockRequest.params = { id: 'bet1' };
      mockRequest.body = { status: 'WON' };

      await BetController.updateBetStatus(mockRequest as Request, mockResponse as Response);

      expect(BetService.updateBetStatus).toHaveBeenCalledWith('bet1', 'WON');
      expect(jsonMock).toHaveBeenCalledWith(mockBet);
    });
  });

  describe('deleteBet', () => {
    it('should delete a bet and return 204', async () => {
      (BetService.deleteBet as jest.Mock).mockResolvedValue(undefined);

      mockRequest.params = { id: 'bet1' };

      await BetController.deleteBet(mockRequest as Request, mockResponse as Response);

      expect(BetService.deleteBet).toHaveBeenCalledWith('bet1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });
});
