import { Request, Response } from 'express';
import { authenticate } from '../auth.middleware';
import AuthService from '../../services/auth.service';

jest.mock('../../services/auth.service');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next function when token is valid', () => {
    // Configurar mock para simular token válido
    (AuthService.verifyToken as jest.Mock).mockReturnValue({ userId: 'user1' });
    
    // Configurar request com token válido
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    // Executar o middleware
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar resultados
    expect(AuthService.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockRequest.userId).toBe('user1');
    expect(nextFunction).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header is missing', () => {
    // Configurar request sem header de autorização
    mockRequest.headers = {};

    // Executar o middleware
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar resultados
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Token de autenticação não fornecido' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when token format is invalid', () => {
    // Configurar request com formato de token inválido
    mockRequest.headers = {
      authorization: 'InvalidFormat token',
    };

    // Executar o middleware
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar resultados
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Formato de token inválido' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    // Configurar mock para simular token inválido
    (AuthService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido');
    });
    
    // Configurar request com token inválido
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    // Executar o middleware
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar resultados
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
