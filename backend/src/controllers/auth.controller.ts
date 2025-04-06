import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password } = req.body;
      
      // Validação básica
      if (!email || !username || !password) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      const user = await AuthService.register(email, username, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao registrar usuário' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validação básica
      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }
      
      const auth = await AuthService.login(email, password);
      res.json(auth);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Erro ao fazer login' });
    }
  }
}

export default AuthController;
