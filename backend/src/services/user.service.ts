/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar a senha
      }
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({ 
      where: { id },
      include: {
        bets: true // Inclui as apostas do usuário
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Remover a senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateUser(id: string, data: { email?: string; username?: string; }) {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o email já está em uso (se estiver sendo atualizado)
    if (data.email && data.email !== user.email) {
      const existingUserByEmail = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUserByEmail) {
        throw new Error('Email já está em uso');
      }
    }

    // Verificar se o username já está em uso (se estiver sendo atualizado)
    if (data.username && data.username !== user.username) {
      const existingUserByUsername = await prisma.user.findUnique({ where: { username: data.username } });
      if (existingUserByUsername) {
        throw new Error('Nome de usuário já está em uso');
      }
    }

    // Atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });

    // Remover a senha antes de retornar
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async updatePassword(id: string, currentPassword: string, newPassword: string) {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Atualizar a senha
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  static async deleteUser(id: string) {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Excluir as apostas do usuário primeiro para evitar violações de chave estrangeira
    await prisma.bet.deleteMany({ where: { userId: id } });

    // Excluir o usuário
    await prisma.user.delete({ where: { id } });

    return { message: 'Usuário excluído com sucesso' };
  }

  static async updateBalance(id: string, operation: 'deposit' | 'withdraw', amount: number) {
    if (amount <= 0) {
      throw new Error('O valor deve ser maior que zero');
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    let newBalance: number;

    if (operation === 'deposit') {
      newBalance = user.balance + amount;
    } else {
      // Verificar se o usuário tem saldo suficiente para saque
      if (user.balance < amount) {
        throw new Error('Saldo insuficiente');
      }
      newBalance = user.balance - amount;
    }

    // Atualizar o saldo do usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { balance: newBalance }
    });

    // Remover a senha antes de retornar
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async getUserBets(id: string) {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Buscar as apostas do usuário
    return prisma.bet.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default UserService;
