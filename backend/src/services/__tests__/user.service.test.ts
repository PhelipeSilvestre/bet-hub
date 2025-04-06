import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import UserService from '../user.service';

// Mock do Prisma Client
jest.mock('@prisma/client', () => {
  const mockFindUnique = jest.fn();
  const mockFindMany = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockDeleteMany = jest.fn();
  
  return { 
    PrismaClient: jest.fn(() => ({
      user: {
        findUnique: mockFindUnique,
        findMany: mockFindMany,
        update: mockUpdate,
        delete: mockDelete,
      },
      bet: {
        findMany: mockFindMany,
        deleteMany: mockDeleteMany,
      },
      $disconnect: jest.fn(),
    }))
  };
});

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Obter instância mockada do prisma
const prisma = new PrismaClient();
const mockUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockUserFindMany = prisma.user.findMany as jest.Mock;
const mockUserUpdate = prisma.user.update as jest.Mock;
const mockUserDelete = prisma.user.delete as jest.Mock;
const mockBetFindMany = prisma.bet.findMany as jest.Mock;
const mockBetDeleteMany = prisma.bet.deleteMany as jest.Mock;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return a list of all users without passwords', async () => {
      const mockUsers = [
        { id: 'user1', email: 'user1@example.com', username: 'user1', balance: 100 },
        { id: 'user2', email: 'user2@example.com', username: 'user2', balance: 200 },
      ];
      
      mockUserFindMany.mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(mockUserFindMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          username: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID without password', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
        username: 'user1',
        password: 'hashedPassword',
        balance: 100,
        bets: [],
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const result = await UserService.getUserById('user1');

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
        include: { bets: true }
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 'user1');
    });

    it('should throw an error if user is not found', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      await expect(UserService.getUserById('nonexistent')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('updateUser', () => {
    it('should update a user\'s email and return the updated user without password', async () => {
      const mockUser = {
        id: 'user1',
        email: 'old@example.com',
        username: 'user1',
        password: 'hashedPassword',
      };
      
      const updatedUser = {
        ...mockUser,
        email: 'new@example.com',
      };

      mockUserFindUnique.mockResolvedValueOnce(mockUser); // Para a verificação do usuário
      mockUserFindUnique.mockResolvedValueOnce(null); // Para a verificação de email duplicado
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser('user1', { email: 'new@example.com' });

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { email: 'new@example.com' }
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', 'new@example.com');
    });

    it('should throw an error if email is already in use', async () => {
      const mockUser = {
        id: 'user1',
        email: 'old@example.com',
        username: 'user1',
      };
      
      const existingUser = {
        id: 'user2',
        email: 'existing@example.com',
      };

      mockUserFindUnique.mockResolvedValueOnce(mockUser); // Para a verificação do usuário
      mockUserFindUnique.mockResolvedValueOnce(existingUser); // Para a verificação de email duplicado

      await expect(UserService.updateUser('user1', { email: 'existing@example.com' }))
        .rejects.toThrow('Email já está em uso');
    });
  });

  describe('updatePassword', () => {
    it('should update a user\'s password', async () => {
      const mockUser = {
        id: 'user1',
        password: 'hashedPassword',
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Senha atual válida
      mockUserUpdate.mockResolvedValue({ ...mockUser, password: 'newHashedPassword' });

      const result = await UserService.updatePassword('user1', 'currentPassword', 'newPassword');

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('currentPassword', 'hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { password: 'hashedPassword' }
      });
      expect(result).toEqual({ message: 'Senha atualizada com sucesso' });
    });

    it('should throw an error if current password is incorrect', async () => {
      const mockUser = {
        id: 'user1',
        password: 'hashedPassword',
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Senha atual inválida

      await expect(UserService.updatePassword('user1', 'wrongPassword', 'newPassword'))
        .rejects.toThrow('Senha atual incorreta');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and their bets', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockBetDeleteMany.mockResolvedValue({ count: 2 }); // Simulando exclusão de 2 apostas
      mockUserDelete.mockResolvedValue(mockUser);

      const result = await UserService.deleteUser('user1');

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockBetDeleteMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(mockUserDelete).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(result).toEqual({ message: 'Usuário excluído com sucesso' });
    });
  });

  describe('updateBalance', () => {
    it('should add funds to user balance on deposit', async () => {
      const mockUser = {
        id: 'user1',
        balance: 100,
        password: 'hashedPassword',
      };
      
      const updatedUser = {
        ...mockUser,
        balance: 150,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await UserService.updateBalance('user1', 'deposit', 50);

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { balance: 150 }
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('balance', 150);
    });

    it('should subtract funds from user balance on withdraw', async () => {
      const mockUser = {
        id: 'user1',
        balance: 100,
        password: 'hashedPassword',
      };
      
      const updatedUser = {
        ...mockUser,
        balance: 50,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await UserService.updateBalance('user1', 'withdraw', 50);

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { balance: 50 }
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('balance', 50);
    });

    it('should throw an error if withdrawal amount exceeds balance', async () => {
      const mockUser = {
        id: 'user1',
        balance: 30,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      await expect(UserService.updateBalance('user1', 'withdraw', 50))
        .rejects.toThrow('Saldo insuficiente');
    });

    it('should throw an error if amount is invalid', async () => {
      await expect(UserService.updateBalance('user1', 'deposit', 0))
        .rejects.toThrow('O valor deve ser maior que zero');
      
      await expect(UserService.updateBalance('user1', 'deposit', -10))
        .rejects.toThrow('O valor deve ser maior que zero');
    });
  });

  describe('getUserBets', () => {
    it('should return a list of bets for a user', async () => {
      const mockUser = {
        id: 'user1',
      };
      
      const mockBets = [
        { id: 'bet1', userId: 'user1', amount: 50 },
        { id: 'bet2', userId: 'user1', amount: 30 },
      ];

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockBetFindMany.mockResolvedValue(mockBets);

      const result = await UserService.getUserBets('user1');

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(mockBetFindMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockBets);
    });
  });
});
