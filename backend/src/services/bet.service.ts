import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BetService {
  static async createBet(userId: string, eventId: string, amount: number, odds: number, sport: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    const potentialPayout = amount * odds;

    const bet = await prisma.bet.create({
      data: {
        userId,
        eventId,
        amount,
        odds,
        potentialPayout,
        sport,
      },
    });

    // Atualizar saldo do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - amount },
    });

    return bet;
  }

  static async getBetsByUser(userId: string) {
    return prisma.bet.findMany({ where: { userId } });
  }

  static async getBetById(id: string) {
    return prisma.bet.findUnique({ where: { id } });
  }

  static async updateBetStatus(id: string, status: 'PENDING' | 'WON' | 'LOST') {
    return prisma.bet.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteBet(id: string) {
    return prisma.bet.delete({ where: { id } });
  }
}

export default BetService;
