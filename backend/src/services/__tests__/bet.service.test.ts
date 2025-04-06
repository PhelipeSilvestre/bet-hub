// Import types only, not implementations


// Set up mock module factories
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  bet: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock the PrismaClient module
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}));

// Now import the service (after mocks are set up)
// This breaks the circular dependency
import BetService from '../bet.service';

describe('BetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBet', () => {
    it('should create a bet and deduct the user balance', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        id: 'user1',
        balance: 100,
      });

      mockPrismaClient.bet.create.mockResolvedValue({
        id: 'bet1',
        userId: 'user1',
        eventId: 'event1',
        amount: 50,
        odds: 2.0,
        potentialPayout: 100,
        sport: 'football',
        status: 'PENDING',
      });

      mockPrismaClient.user.update.mockResolvedValue({
        id: 'user1',
        balance: 50,
      });

      const bet = await BetService.createBet('user1', 'event1', 50, 2.0, 'football');

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockPrismaClient.bet.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          eventId: 'event1',
          amount: 50,
          odds: 2.0,
          potentialPayout: 100,
          sport: 'football',
        },
      });
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { balance: 50 },
      });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', potentialPayout: 100 }));
    });

    it('should throw an error if the user does not exist', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      await expect(BetService.createBet('user1', 'event1', 50, 2.0, 'football')).rejects.toThrow(
        'Usuário não encontrado'
      );
    });

    it('should throw an error if the user has insufficient balance', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        id: 'user1',
        balance: 30,
      });

      await expect(BetService.createBet('user1', 'event1', 50, 2.0, 'football')).rejects.toThrow(
        'Saldo insuficiente'
      );
    });
  });

  describe('getBetsByUser', () => {
    it('should return a list of bets for a user', async () => {
      mockPrismaClient.bet.findMany.mockResolvedValue([
        { id: 'bet1', userId: 'user1', amount: 50 },
      ]);

      const bets = await BetService.getBetsByUser('user1');

      expect(mockPrismaClient.bet.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(bets).toHaveLength(1);
      expect(bets[0]).toEqual(expect.objectContaining({ id: 'bet1', amount: 50 }));
    });
  });

  describe('getBetById', () => {
    it('should return a bet by its ID', async () => {
      mockPrismaClient.bet.findUnique.mockResolvedValue({
        id: 'bet1',
        userId: 'user1',
        amount: 50,
      });

      const bet = await BetService.getBetById('bet1');

      expect(mockPrismaClient.bet.findUnique).toHaveBeenCalledWith({ where: { id: 'bet1' } });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', amount: 50 }));
    });

    it('should return null if the bet does not exist', async () => {
      mockPrismaClient.bet.findUnique.mockResolvedValue(null);

      const bet = await BetService.getBetById('bet1');

      expect(bet).toBeNull();
    });
  });

  describe('updateBetStatus', () => {
    it('should update the status of a bet', async () => {
      mockPrismaClient.bet.update.mockResolvedValue({
        id: 'bet1',
        status: 'WON',
      });

      const bet = await BetService.updateBetStatus('bet1', 'WON');

      expect(mockPrismaClient.bet.update).toHaveBeenCalledWith({
        where: { id: 'bet1' },
        data: { status: 'WON' },
      });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', status: 'WON' }));
    });
  });

  describe('deleteBet', () => {
    it('should delete a bet by its ID', async () => {
      mockPrismaClient.bet.delete.mockResolvedValue({ id: 'bet1' });

      const bet = await BetService.deleteBet('bet1');

      expect(mockPrismaClient.bet.delete).toHaveBeenCalledWith({ where: { id: 'bet1' } });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1' }));
    });
  });
});
