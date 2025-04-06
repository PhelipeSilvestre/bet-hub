/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config(); // Carrega as variáveis do .env

// Cache para armazenar resultados e reduzir chamadas à API
const cache = new NodeCache({ stdTTL: 300 }); // 5 min por padrão

class SportsService {
  private static readonly apiKey = process.env.SPORTS_API_KEY;
  private static readonly baseUrl = process.env.SPORTS_API_URL;

  /**
   * Obtém partidas futuras de todos os esportes disponíveis
   * @param region Região para as odds
   * @param maxResults Número máximo de resultados por esporte
   * @param cacheTTL Tempo de vida do cache em segundos
   */
  static async getUpcomingMatches(region = 'us', maxResults = 10, cacheTTL = 600) {
    const cacheKey = `upcoming_matches_${region}_${maxResults}`;
    
    // Verificar cache primeiro
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Buscar todos os esportes disponíveis
      const sports = await this.getAllSports(region) as any[];
      
      // Array para armazenar todos os jogos futuros
      const upcomingMatches = [];
      
      // Limitar o número de esportes processados (para economizar chamadas à API)
      const populatedSports = sports.filter((sport: any) => sport.active && !sport.has_outrights)
                                     .slice(0, 5); // Limitar a 5 esportes mais populares
      
      // Para cada esporte, buscar eventos futuros
      for (const sport of populatedSports) {
        try {
          const sportKey = sport.key;
          const sportEvents = await this.getOddsForSport(sportKey, region);
          
          // Filtrar apenas eventos futuros e formatar dados
          const now = new Date();
          const futureEvents = sportEvents
            .filter((event: any) => {
              const eventDate = new Date(event.commence_time);
              return eventDate > now;
            })
            .map((event: any) => ({
              id: event.id,
              sportKey: sportKey,
              sportName: sport.title,
              homeTeam: event.home_team,
              awayTeam: event.away_team,
              startTime: event.commence_time,
              odds: this.extractMainOdds(event.bookmakers),
            }))
            .slice(0, maxResults);
          
          upcomingMatches.push(...futureEvents);
        } catch (error) {
          console.error(`Erro ao buscar eventos para ${sport.key}:`, error);
          // Continuar para o próximo esporte
        }
      }
      
      // Ordenar por data de início
      upcomingMatches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      // Armazenar no cache
      cache.set(cacheKey, upcomingMatches, cacheTTL);
      
      return upcomingMatches;
    } catch (error) {
      console.error('Erro ao buscar partidas futuras:', error);
      throw new Error('Falha ao obter partidas futuras');
    }
  }

  /**
   * Extrai as odds principais de uma lista de bookmakers
   * @param bookmakers Lista de bookmakers com odds
   */
  private static extractMainOdds(bookmakers: any[]) {
    if (!bookmakers || bookmakers.length === 0) {
      return { home: null, away: null, draw: null };
    }
    
    // Usar o primeiro bookmaker disponível
    const bookmaker = bookmakers[0];
    
    // Encontrar o mercado de head-to-head
    const h2hMarket = bookmaker.markets.find((market: any) => market.key === 'h2h');
    
    if (!h2hMarket || !h2hMarket.outcomes) {
      return { home: null, away: null, draw: null };
    }
    
    // Extrair odds para home, away e draw (se disponível)
    const outcomes = h2hMarket.outcomes;
    const homeOutcome = outcomes.find((o: any) => o.name.includes('home') || outcomes.length === 2 && outcomes.indexOf(o) === 0);
    const awayOutcome = outcomes.find((o: any) => o.name.includes('away') || outcomes.length === 2 && outcomes.indexOf(o) === 1);
    const drawOutcome = outcomes.find((o: any) => o.name.toLowerCase() === 'draw');
    
    return {
      home: homeOutcome ? homeOutcome.price : null,
      away: awayOutcome ? awayOutcome.price : null,
      draw: drawOutcome ? drawOutcome.price : null,
    };
  }

  /**
   * Obtém todos os esportes disponíveis
   */
  static async getAllSports(region = 'us', cacheTTL = 3600) {
    const cacheKey = `sports_${region}`;
    
    // Verificar cache primeiro
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData as any[];
    }

    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          apiKey: this.apiKey,
          regions: region
        }
      });

      // Armazenar no cache
      cache.set(cacheKey, response.data, cacheTTL);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar esportes:', error);
      throw new Error('Falha ao obter dados de esportes');
    }
  }

  /**
   * Obtém odds para um esporte específico
   */
  static async getOddsForSport(sportKey: string, region = 'us', markets = 'h2h', cacheTTL = 300): Promise<any[]> {
    const cacheKey = `odds_${sportKey}_${region}_${markets}`;
    
    // Verificar cache primeiro
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData as any[];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/${sportKey}/odds`, {
        params: {
          apiKey: this.apiKey,
          regions: region,
          markets: markets,
          oddsFormat: 'decimal'
        }
      });

      // Armazenar no cache
      cache.set(cacheKey, response.data, cacheTTL);
      
      return response.data as  any[];
    } catch (error) {
      console.error(`Erro ao buscar odds para ${sportKey}:`, error);
      throw new Error(`Falha ao obter odds para ${sportKey}`);
    }
  }

  /**
   * Obtém eventos para um esporte específico com suas odds
   */
  static async getEventsWithOdds(sportKey: string, region = 'us', markets = 'h2h') {
    try {
      const odds: any[] = await this.getOddsForSport(sportKey, region, markets);
      
      // Transformar os dados para o formato necessário para nossa aplicação
      return odds.map((event: any) => ({
        id: event.id,
        sportKey: event.sport_key,
        sportTitle: event.sport_title,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        commenceTime: event.commence_time,
        bookmakers: event.bookmakers.map((bookmaker: any) => ({
          key: bookmaker.key,
          title: bookmaker.title,
          markets: bookmaker.markets.map((market: any) => ({
            key: market.key,
            outcomes: market.outcomes.map((outcome: any) => ({
              name: outcome.name,
              price: outcome.price,
            }))
          }))
        }))
      }));
    } catch (error) {
      console.error(`Erro ao processar eventos para ${sportKey}:`, error);
      throw new Error(`Falha ao obter eventos para ${sportKey}`);
    }
  }

  /**
   * Obtém um evento específico com suas odds
   */
  static async getEvent(sportKey: string, eventId: string, region = 'us', markets = 'h2h') {
    try {
      const events = await this.getEventsWithOdds(sportKey, region, markets);
      return events.find((event: any) => event.id === eventId);
    } catch (error) {
      console.error(`Erro ao buscar evento ${eventId}:`, error);
      throw new Error(`Evento não encontrado: ${eventId}`);
    }
  }

  /**
   * Obtém as melhores odds para um evento
   */
  static async getBestOddsForEvent(sportKey: string, eventId: string, region = 'us', markets = 'h2h') {
    try {
      const event = await this.getEvent(sportKey, eventId, region, markets);
      
      if (!event) {
        throw new Error(`Evento não encontrado: ${eventId}`);
      }
      
      // Para cada outcome possível, encontre a melhor odd entre todos os bookmakers
      const outcomes = new Map();
      
      event.bookmakers.forEach((bookmaker: any) => {
        bookmaker.markets.forEach((market: any) => {
          market.outcomes.forEach((outcome: any) => {
            if (!outcomes.has(outcome.name) || outcomes.get(outcome.name).price < outcome.price) {
              outcomes.set(outcome.name, {
                price: outcome.price,
                bookmaker: bookmaker.title
              });
            }
          });
        });
      });
      
      // Converter o Map para um objeto
      const bestOdds: Record<string, any> = {};
      outcomes.forEach((value, key) => {
        bestOdds[key] = value;
      });
      
      return {
        eventId: event.id,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        commenceTime: event.commenceTime,
        bestOdds
      };
    } catch (error) {
      console.error(`Erro ao buscar melhores odds para ${eventId}:`, error);
      throw new Error(`Falha ao obter melhores odds para ${eventId}`);
    }
  }
}

export default SportsService;
