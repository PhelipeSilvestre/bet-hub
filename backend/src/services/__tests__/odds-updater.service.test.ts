/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import OddsUpdaterService from '../odds-updater.service';
import SportsService from '../sports.service';
import cron from 'node-cron';

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    bet: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

// Mock do SportsService
jest.mock('../sports.service');

// Define the stop mock function that we can access later
const stopMock = jest.fn();

// Mock do node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(() => ({
    stop: stopMock,
  })),
  validate: jest.fn().mockReturnValue(true),
}));

// Em vez de mockar o cron-parser, vamos mockar o método getNextRunTime
jest.spyOn(OddsUpdaterService as any, 'getNextRunTime').mockReturnValue('próxima execução simulada');

const prisma = new PrismaClient();
const mockBetFindMany = prisma.bet.findMany as jest.Mock;

describe('OddsUpdaterService', () => {
  beforeEach(() => {
    // Silence console output during tests
    console.log = jest.fn();
    console.error = jest.fn();
    
    jest.clearAllMocks();
    // Reset isRunning state before each test
    (OddsUpdaterService as any).isRunning = false;
    // Reset the cronJob property as well
    (OddsUpdaterService as any).cronJob = null;
  });

  afterEach(() => {
    // Restore console functions after each test
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  // Add cleanup after all tests
  afterAll(() => {
    // Ensure any cron jobs are stopped
    if ((OddsUpdaterService as any).cronJob) {
      OddsUpdaterService.stopUpdater();
    }
  });

  describe('startUpdater', () => {
    it('should start the cron job with the provided expression', () => {
      OddsUpdaterService.startUpdater('0 */2 * * *');
      
      expect(cron.schedule).toHaveBeenCalledWith('0 */2 * * *', expect.any(Function));
    });

    it('should use default cron expression when none is provided', () => {
      OddsUpdaterService.startUpdater();
      
      expect(cron.schedule).toHaveBeenCalledWith('*/15 * * * *', expect.any(Function));
    });

    it('should stop existing job before creating a new one', () => {
      // Set up the cronJob property manually to simulate an existing job
      (OddsUpdaterService as any).cronJob = { stop: stopMock };
      
      // Start a new job
      OddsUpdaterService.startUpdater();
      
      // Verify that stop was called on the existing job
      expect(stopMock).toHaveBeenCalled();
    });
  });

  describe('stopUpdater', () => {
    it('should stop the cron job if it exists', () => {
      // Configurar um job
      const stopMock = jest.fn();
      (cron.schedule as jest.Mock).mockReturnValueOnce({ stop: stopMock });
      
      OddsUpdaterService.startUpdater();
      OddsUpdaterService.stopUpdater();
      
      expect(stopMock).toHaveBeenCalled();
    });

    it('should do nothing if no cron job exists', () => {
      // Garantir que não existe job ativo
      OddsUpdaterService.stopUpdater();
      OddsUpdaterService.stopUpdater(); // Segunda chamada não deve causar erro
      
      // Não há expectativas específicas, apenas garantir que não causa erro
    });
  });

  describe('updateAllOdds', () => {
    it('should update odds for active bets', async () => {
      // Mock para SportsService.getAllSports
      const mockSports = [
        { key: 'soccer' },
        { key: 'basketball' }
      ];
      (SportsService.getAllSports as jest.Mock).mockResolvedValue(mockSports);
      
      // Mock para active bets
      const mockSoccerBets = [
        { id: 'bet1', eventId: 'event1', status: 'PENDING' },
        { id: 'bet2', eventId: 'event1', status: 'PENDING' }, // Mesmo evento para testar deduplicação
        { id: 'bet3', eventId: 'event2', status: 'PENDING' }
      ];
      
      const mockBasketballBets = [
        { id: 'bet4', eventId: 'event3', status: 'PENDING' }
      ];
      
      mockBetFindMany
        .mockResolvedValueOnce(mockSoccerBets)
        .mockResolvedValueOnce(mockBasketballBets);
      
      // Mock para getBestOddsForEvent
      (SportsService.getBestOddsForEvent as jest.Mock).mockResolvedValue({});
      
      // Executar o método
      await OddsUpdaterService.updateAllOdds();
      
      // Verificações
      expect(SportsService.getAllSports).toHaveBeenCalled();
      expect(mockBetFindMany).toHaveBeenCalledWith({
        where: { sport: 'soccer', status: 'PENDING' }
      });
      expect(mockBetFindMany).toHaveBeenCalledWith({
        where: { sport: 'basketball', status: 'PENDING' }
      });
      
      // Deve ter chamado getBestOddsForEvent exatamente 3 vezes (para os eventos únicos)
      expect(SportsService.getBestOddsForEvent).toHaveBeenCalledTimes(3);
      expect(SportsService.getBestOddsForEvent).toHaveBeenCalledWith('soccer', 'event1');
      expect(SportsService.getBestOddsForEvent).toHaveBeenCalledWith('soccer', 'event2');
      expect(SportsService.getBestOddsForEvent).toHaveBeenCalledWith('basketball', 'event3');
    });

    it('should not run multiple updates simultaneously', async () => {
      // Simulando uma atualização já em andamento
      (OddsUpdaterService as any).isRunning = true;
      
      await OddsUpdaterService.updateAllOdds();
      
      // Não deve ter chamado nenhum método do serviço
      expect(SportsService.getAllSports).not.toHaveBeenCalled();
      expect(mockBetFindMany).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Explicitly set isRunning to false before the test
      (OddsUpdaterService as any).isRunning = false;
      
      // Simulando um erro ao obter esportes
      (SportsService.getAllSports as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      // Isso não deve lançar exceção
      await OddsUpdaterService.updateAllOdds();
      
      // Garantir que isRunning é resetado mesmo em caso de erro
      expect((OddsUpdaterService as any).isRunning).toBe(false);
    });
  });
});
