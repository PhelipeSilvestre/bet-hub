import { Request, Response } from 'express';
import UserController from '../user.controller';
import UserService from '../../services/user.service';

jest.mock('../../services/user.service');

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockRequest = {
      userId: 'user1', // Simulando usuário autenticado
      params: {},
      body: {},
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return a list of all users', async () => {
      const mockUsers = [
        { id: 'user1', email: 'user1@example.com' },
        { id: 'user2', email: 'user2@example.com' },
      ];
      
      (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await UserController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(UserService.getAllUsers).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors and return 500', async () => {
      (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

      await UserController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getUserProfile', () => {
    it('should return the authenticated user\'s profile', async () => {
      const mockUser = { id: 'user1', email: 'user1@example.com' };
      
      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await UserController.getUserProfile(mockRequest as Request, mockResponse as Response);

      expect(UserService.getUserById).toHaveBeenCalledWith('user1');
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors and return 404', async () => {
      (UserService.getUserById as jest.Mock).mockRejectedValue(new Error('Usuário não encontrado'));

      await UserController.getUserProfile(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });

  describe('updateUserProfile', () => {
    it('should update the user profile', async () => {
      mockRequest.body = { email: 'new@example.com', username: 'newusername' };
      
      const updatedUser = { id: 'user1', email: 'new@example.com', username: 'newusername' };
      (UserService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await UserController.updateUserProfile(mockRequest as Request, mockResponse as Response);

      expect(UserService.updateUser).toHaveBeenCalledWith('user1', { email: 'new@example.com', username: 'newusername' });
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 if no update data is provided', async () => {
      mockRequest.body = {};

      await UserController.updateUserProfile(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Nenhum dado fornecido para atualização' });
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      mockRequest.body = { currentPassword: 'oldpass', newPassword: 'newpass' };
      
      const result = { message: 'Senha atualizada com sucesso' };
      (UserService.updatePassword as jest.Mock).mockResolvedValue(result);

      await UserController.updatePassword(mockRequest as Request, mockResponse as Response);

      expect(UserService.updatePassword).toHaveBeenCalledWith('user1', 'oldpass', 'newpass');
      expect(jsonMock).toHaveBeenCalledWith(result);
    });

    it('should return 400 if passwords are not provided', async () => {
      mockRequest.body = { currentPassword: 'oldpass' }; // Missing newPassword

      await UserController.updatePassword(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Senha atual e nova senha são obrigatórias' });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user account', async () => {
      const result = { message: 'Usuário excluído com sucesso' };
      (UserService.deleteUser as jest.Mock).mockResolvedValue(result);

      await UserController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(UserService.deleteUser).toHaveBeenCalledWith('user1');
      expect(jsonMock).toHaveBeenCalledWith(result);
    });
  });

  describe('deposit', () => {
    it('should deposit funds to user account', async () => {
      mockRequest.body = { amount: 100 };
      
      const updatedUser = { id: 'user1', balance: 200 };
      (UserService.updateBalance as jest.Mock).mockResolvedValue(updatedUser);

      await UserController.deposit(mockRequest as Request, mockResponse as Response);

      expect(UserService.updateBalance).toHaveBeenCalledWith('user1', 'deposit', 100);
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 if amount is invalid', async () => {
      mockRequest.body = { amount: -50 };

      await UserController.deposit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Valor de depósito inválido' });
    });
  });

  describe('withdraw', () => {
    it('should withdraw funds from user account', async () => {
      mockRequest.body = { amount: 50 };
      
      const updatedUser = { id: 'user1', balance: 50 };
      (UserService.updateBalance as jest.Mock).mockResolvedValue(updatedUser);

      await UserController.withdraw(mockRequest as Request, mockResponse as Response);

      expect(UserService.updateBalance).toHaveBeenCalledWith('user1', 'withdraw', 50);
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 if amount is invalid', async () => {
      mockRequest.body = { amount: 0 };

      await UserController.withdraw(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Valor de saque inválido' });
    });
  });

  describe('getUserBets', () => {
    it('should return user bets', async () => {
      const mockBets = [
        { id: 'bet1', userId: 'user1', amount: 50 },
        { id: 'bet2', userId: 'user1', amount: 30 },
      ];
      
      (UserService.getUserBets as jest.Mock).mockResolvedValue(mockBets);

      await UserController.getUserBets(mockRequest as Request, mockResponse as Response);

      expect(UserService.getUserBets).toHaveBeenCalledWith('user1');
      expect(jsonMock).toHaveBeenCalledWith(mockBets);
    });
  });

  describe('getUserById', () => {
    it('should return a specific user by ID', async () => {
      mockRequest.params = { id: 'user2' };
      
      const mockUser = { id: 'user2', email: 'user2@example.com' };
      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await UserController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(UserService.getUserById).toHaveBeenCalledWith('user2');
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });
  });
});
