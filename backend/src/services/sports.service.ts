import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

class SportsService {
  private static API_URL = process.env.SPORTS_API_URL || '';
  private static API_KEY = process.env.SPORTS_API_KEY || '';

  static async getUpcomingMatches() {
    try {
      const response = await axios.get(`${this.API_URL}`, {
        params: { apiKey: this.API_KEY },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      throw new Error('Falha ao obter dados da API de esportes');
    }
  }
}

export default SportsService;
