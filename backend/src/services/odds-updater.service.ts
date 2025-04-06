/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import SportsService from './sports.service';
import cron from 'node-cron';

const prisma = new PrismaClient();

/**
 * Serviço para atualizar odds em segundo plano
 */
class OddsUpdaterService {
  private static isRunning = false;
  private static cronJob: cron.ScheduledTask | null = null;

  /**
   * Inicia o serviço de atualização periódica de odds
   * @param cronExpression Expressão cron para definir a frequência (padrão: a cada 15 minutos)
   */
  static startUpdater(cronExpression = '*/15 * * * *') {
    if (this.cronJob) {
      this.stopUpdater();
    }

    this.cronJob = cron.schedule(cronExpression, async () => {
      try {
        await this.updateAllOdds();
        console.log(`Odds atualizadas com sucesso em ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Erro ao atualizar odds:', error);
      }
    });

    console.log(`Serviço de atualização de odds iniciado. Próxima execução em ${this.getNextRunTime(cronExpression)}`);
  }

  /**
   * Para o serviço de atualização
   */
  static stopUpdater() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('Serviço de atualização de odds parado');
    }
  }

  // Add this method to ensure cleanup for testing
  static cleanup() {
    this.stopUpdater();
    this.isRunning = false;
  }

  /**
   * Atualiza as odds de todos os eventos ativos
   */
  static async updateAllOdds() {
    if (this.isRunning) {
      console.log('Atualização de odds já está em execução');
      return;
    }

    this.isRunning = true;

    try {
      // Buscar todos os esportes disponíveis
      const sports = await SportsService.getAllSports() as { key: string }[];
      
      for (const sport of sports) {
        try {
          // Buscar todas as apostas ativas para este esporte
          const activeBets = await prisma.bet.findMany({
            where: {
              sport: sport.key,
              status: 'PENDING'
            }
          });

          // Agrupar apostas por eventId para evitar chamadas duplicadas
          const eventIds = [...new Set(activeBets.map((bet: { eventId: string; }) => bet.eventId as string))];
          
          for (const eventId of eventIds) {
            try {
              // Buscar odds atualizadas para este evento
              const updatedEvent = await SportsService.getBestOddsForEvent(sport.key, eventId as string);
              
              // Armazenar as odds atualizadas (poderia ser em uma tabela do banco de dados)
              console.log(`Odds atualizadas para evento ${eventId} do esporte ${sport.key}`);
              
              // Aqui você poderia implementar a lógica para atualizar as apostas
              // baseadas nas novas odds, por exemplo, marcar apostas como ganhas/perdidas
              // se o evento já foi concluído
            } catch (eventError) {
              console.error(`Erro ao atualizar odds para evento ${eventId}:`, eventError);
            }
          }
        } catch (sportError) {
          console.error(`Erro ao processar esporte ${sport.key}:`, sportError);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar odds:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Calcula o próximo horário de execução com base na expressão cron
   */
  private static getNextRunTime(cronExpression: string): string {
    try {
      const cronInterval = cron.validate(cronExpression) ? cronExpression : '*/15 * * * *';
      const schedule = cron.schedule(cronInterval, () => {});
      const parser = require('cron-parser');
      const parsedInterval = parser.parseExpression(cronInterval);
      const nextDate = parsedInterval.next().toDate();
      return nextDate.toLocaleString();
    } catch (error) {
      return 'horário desconhecido';
    }
  }
}

// Add this for test environments to ensure cleanup
if (process.env.NODE_ENV === 'test') {
  // Ensure cleanup before process exits
  process.on('beforeExit', () => {
    OddsUpdaterService.cleanup();
  });
}

export default OddsUpdaterService;
