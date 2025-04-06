import { Request, Response } from 'express';
import AuthController from '../auth.controller';
import AuthService from '../../services/auth.service';

jest.mock('../../services/auth.service');

describe('AuthController', () => {
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

  describe('register', () => {
    it('should return 201 and user data on successful registration', async () => {
      // Configurar mock para simular registros bem-sucedidos
      const mockUser = { id: 'user1', email: 'test@example.com', username: 'testuser' };
      (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

      // Configurar request
      mockRequest.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      // Executar o método
      await AuthController.register(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(AuthService.register).toHaveBeenCalledWith(
        'test@example.com',
        'testuser',
        'password123'
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if required fields are missing', async () => {
      // Configurar request com campos faltando
      mockRequest.body = {
        email: 'test@example.com',
        // username faltando
        password: 'password123',
      };

      // Executar o método
      await AuthController.register(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Todos os campos são obrigatórios' });
    });

    it('should return 400 if registration fails', async () => {
      // Configurar mock para simular falha no registro
      (AuthService.register as jest.Mock).mockRejectedValue(
        new Error('Email já está em uso')
      );

      // Configurar request
      mockRequest.body = {
        email: 'existing@example.com',
        username: 'testuser',
        password: 'password123',
      };

      // Executar o método
      await AuthController.register(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email já está em uso' });
    });
  });

  describe('login', () => {
    it('should return user data and token on successful login', async () => {
      // Configurar mock para simular login bem-sucedido
      const mockAuthResult = {
        user: { id: 'user1', email: 'test@example.com' },
        token: 'jwt-token',
      };
      (AuthService.login as jest.Mock).mockResolvedValue(mockAuthResult);

      // Configurar request
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Executar o método
      await AuthController.login(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(jsonMock).toHaveBeenCalledWith(mockAuthResult);
    });

    it('should return 400 if required fields are missing', async () => {
      // Configurar request com campos faltando
      mockRequest.body = {
        email: 'test@example.com',
        // password faltando
      };

      // Executar o método
      await AuthController.login(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email e senha são obrigatórios' });
    });

    it('should return 401 if login fails', async () => {
      // Configurar mock para simular falha no login
      (AuthService.login as jest.Mock).mockRejectedValue(
        new Error('Credenciais inválidas')
      );

      // Configurar request
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Executar o método
      await AuthController.login(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
    });
  });
});
