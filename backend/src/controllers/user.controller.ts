import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar usuários' });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      // Usar o ID do usuário autenticado
      const userId = req.userId!;
      const user = await UserService.getUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Erro ao buscar perfil' });
    }
  }

  static async updateUserProfile(req: Request, res: Response): Promise<void>  {
    try {
      const userId = req.userId!;
      const { email, username } = req.body;
      
      if (!email && !username) {
        res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }
      
      const updatedUser = await UserService.updateUser(userId, { email, username });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar perfil' });
    }
  }

  static async updatePassword(req: Request, res: Response): Promise<void>  {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
      }
      
      const result = await UserService.updatePassword(userId, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar senha' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const result = await UserService.deleteUser(userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao excluir usuário' });
    }
  }

  static async deposit(req: Request, res: Response): Promise<void>  {
    try {
      const userId = req.userId!;
      const { amount } = req.body;
      
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({ error: 'Valor de depósito inválido' });
      }
      
      const user = await UserService.updateBalance(userId, 'deposit', Number(amount));
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao realizar depósito' });
    }
  }

  static async withdraw(req: Request, res: Response): Promise<void>  {
    try {
      const userId = req.userId!;
      const { amount } = req.body;
      
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({ error: 'Valor de saque inválido' });
      }
      
      const user = await UserService.updateBalance(userId, 'withdraw', Number(amount));
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao realizar saque' });
    }
  }

  static async getUserBets(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const bets = await UserService.getUserBets(userId);
      res.json(bets);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Erro ao buscar apostas' });
    }
  }

  // Método administrativo para obter detalhes de um usuário específico
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Erro ao buscar usuário' });
    }
  }
}

export default UserController;
