import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../auth.service';

// Improved mocking approach with proper typing
jest.mock('@prisma/client', () => {
  // Create mock functions with explicit type assertions
  const findUniqueMock = jest.fn();
  const createMock = jest.fn();
  
  return { 
    PrismaClient: jest.fn(() => ({
      user: {
        findUnique: findUniqueMock,
        create: createMock,
      },
      $disconnect: jest.fn(),
    }))
  };
});

// Mock other dependencies
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
  verify: jest.fn(),
}));

// Get prisma instance and explicitly type the mocks
const prisma = new PrismaClient();
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Set up mock chain returns with proper typing
      mockFindUnique
        .mockResolvedValueOnce(null)  // First call (email check)
        .mockResolvedValueOnce(null); // Second call (username check)
        
      mockCreate.mockResolvedValueOnce(mockUser);

      const result = await AuthService.register('test@example.com', 'testuser', 'password123');

      expect(mockFindUnique).toHaveBeenCalledTimes(2);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: 'hashedPassword',
        },
      });
      expect(result).toHaveProperty('id', 'user1');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw an error if email already exists', async () => {
      // Configurar mock para simular email existente
      mockFindUnique.mockResolvedValueOnce({
        id: 'user1',
        email: 'existing@example.com',
      });

      // Verificar que o método lança erro
      await expect(
        AuthService.register('existing@example.com', 'testuser', 'password123')
      ).rejects.toThrow('Email já está em uso');
    });

    it('should throw an error if username already exists', async () => {
      // Configurar mock para simular username existente
      mockFindUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'user1',
          username: 'existinguser',
        });

      // Verificar que o método lança erro
      await expect(
        AuthService.register('test@example.com', 'existinguser', 'password123')
      ).rejects.toThrow('Nome de usuário já está em uso');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Configurar mocks
      mockFindUnique.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Executar o método
      const result = await AuthService.login('test@example.com', 'password123');

      // Verificar resultados
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'mockedToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw an error if user does not exist', async () => {
      // Configurar mock para simular usuário inexistente
      mockFindUnique.mockResolvedValue(null);

      // Verificar que o método lança erro
      await expect(AuthService.login('nonexistent@example.com', 'password123')).rejects.toThrow(
        'Credenciais inválidas'
      );
    });

    it('should throw an error if password is invalid', async () => {
      // Configurar mocks
      mockFindUnique.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Verificar que o método lança erro
      await expect(AuthService.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Credenciais inválidas'
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      // Configurar mock para simular token válido
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user1', email: 'test@example.com' });

      // Executar o método
      const result = AuthService.verifyToken('validToken');

      // Verificar resultados
      expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
      expect(result).toEqual({ userId: 'user1', email: 'test@example.com' });
    });

    it('should throw an error for an invalid token', () => {
      // Configurar mock para simular token inválido
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      // Verificar que o método lança erro
      expect(() => AuthService.verifyToken('invalidToken')).toThrow('Token inválido');
    });
  });
});
