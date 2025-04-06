import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';

// Use module augmentation to extend the Request interface
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não fornecido' });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'Formato de token inválido' });
      return;
    }

    const token = parts[1];
    const decoded = AuthService.verifyToken(token) as unknown as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};