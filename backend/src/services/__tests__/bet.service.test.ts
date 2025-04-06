import BetService from '../bet.service';
import { PrismaClient } from '@prisma/client';

// Mock do Prisma Client
jest.mock('@prisma/client', () => {
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
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('BetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBet', () => {
    it('should create a bet and deduct the user balance', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user1',
        balance: 100,
      } as unknown);

      prismaMock.bet.create.mockResolvedValue({
        id: 'bet1',
        userId: 'user1',
        eventId: 'event1',
        amount: 50,
        odds: 2.0,
        potentialPayout: 100,
        sport: 'football',
        status: 'PENDING',
      } as unknown);

      prismaMock.user.update.mockResolvedValue({
        id: 'user1',
        balance: 50,
      } as unknown);

      const bet = await BetService.createBet('user1', 'event1', 50, 2.0, 'football');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(prismaMock.bet.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          eventId: 'event1',
          amount: 50,
          odds: 2.0,
          potentialPayout: 100,
          sport: 'football',
        },
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { balance: 50 },
      });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', potentialPayout: 100 }));
    });

    it('should throw an error if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(BetService.createBet('user1', 'event1', 50, 2.0, 'football')).rejects.toThrow(
        'Usuário não encontrado'
      );
    });

    it('should throw an error if the user has insufficient balance', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user1',
        balance: 30,
      } as unknown);

      await expect(BetService.createBet('user1', 'event1', 50, 2.0, 'football')).rejects.toThrow(
        'Saldo insuficiente'
      );
    });
  });

  describe('getBetsByUser', () => {
    it('should return a list of bets for a user', async () => {
      prismaMock.bet.findMany.mockResolvedValue([
        { id: 'bet1', userId: 'user1', amount: 50 } as unknown,
      ]);

      const bets = await BetService.getBetsByUser('user1');

      expect(prismaMock.bet.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(bets).toHaveLength(1);
      expect(bets[0]).toEqual(expect.objectContaining({ id: 'bet1', amount: 50 }));
    });
  });

  describe('getBetById', () => {
    it('should return a bet by its ID', async () => {
      prismaMock.bet.findUnique.mockResolvedValue({
        id: 'bet1',
        userId: 'user1',
        amount: 50,
      } as unknown);

      const bet = await BetService.getBetById('bet1');

      expect(prismaMock.bet.findUnique).toHaveBeenCalledWith({ where: { id: 'bet1' } });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', amount: 50 }));
    });

    it('should return null if the bet does not exist', async () => {
      prismaMock.bet.findUnique.mockResolvedValue(null);

      const bet = await BetService.getBetById('bet1');

      expect(bet).toBeNull();
    });
  });

  describe('updateBetStatus', () => {
    it('should update the status of a bet', async () => {
      prismaMock.bet.update.mockResolvedValue({
        id: 'bet1',
        status: 'WON',
      } as unknown);

      const bet = await BetService.updateBetStatus('bet1', 'WON');

      expect(prismaMock.bet.update).toHaveBeenCalledWith({
        where: { id: 'bet1' },
        data: { status: 'WON' },
      });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1', status: 'WON' }));
    });
  });

  describe('deleteBet', () => {
    it('should delete a bet by its ID', async () => {
      prismaMock.bet.delete.mockResolvedValue({ id: 'bet1' } as unknown);

      const bet = await BetService.deleteBet('bet1');

      expect(prismaMock.bet.delete).toHaveBeenCalledWith({ where: { id: 'bet1' } });
      expect(bet).toEqual(expect.objectContaining({ id: 'bet1' }));
    });
  });
});
