import axios from 'axios';
import SportsService from '../sports.service';
import NodeCache from 'node-cache';

// Mock de axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock do NodeCache
jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => {
    const store: Record<string, unknown> = {};
    return {
      get: jest.fn((key: string) => store[key] || null),
      set: jest.fn((key: string, value: unknown) => {
        store[key] = value;
        return true;
      }),
      // Adicionar outros métodos conforme necessário
    };
  });
});

describe('SportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSports', () => {
    it('should return sports from API and cache them', async () => {
      const mockSports = [
        { key: 'soccer', title: 'Soccer', active: true },
        { key: 'basketball', title: 'Basketball', active: true }
      ];

          // Mock da resposta da API
    mockAxios.get.mockResolvedValueOnce({
        data: mockSports,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Primeira chamada (sem cache)
      const result = await SportsService.getAllSports();

      expect(mockAxios.get).toHaveBeenCalledWith(expect.any(String), {
        params: {
          apiKey: expect.any(String),
          regions: 'us'
        }
      });
      expect(result).toEqual(mockSports);

      // Segunda chamada (com cache)
      await SportsService.getAllSports();
      // Axios não deve ser chamado novamente
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(SportsService.getAllSports()).rejects.toThrow('Falha ao obter dados de esportes');
    });
  });

  describe('getOddsForSport', () => {
    it('should return odds for a sport from API', async () => {
      const mockOdds = [
        {
          id: 'event1',
          sport_key: 'soccer',
          home_team: 'Team A',
          away_team: 'Team B',
          bookmakers: []
        }
      ];

      mockAxios.get.mockResolvedValueOnce({ data: mockOdds });

      const result = await SportsService.getOddsForSport('soccer');

      expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/soccer/odds'), {
        params: {
          apiKey: expect.any(String),
          regions: 'us',
          markets: 'h2h',
          oddsFormat: 'decimal'
        }
      });
      expect(result).toEqual(mockOdds);
    });
  });

  describe('getUpcomingMatches', () => {
    it('should fetch and format upcoming matches', async () => {
      // Mock para getAllSports
      const mockSports = [
        { key: 'soccer', title: 'Soccer', active: true, has_outrights: false },
        { key: 'basketball', title: 'Basketball', active: true, has_outrights: false }
      ];

      // Mock para getOddsForSport (para dois esportes diferentes)
      const mockSoccerOdds = [
        {
          id: 'match1',
          sport_key: 'soccer',
          sport_title: 'Soccer',
          home_team: 'Team A',
          away_team: 'Team B',
          commence_time: new Date(Date.now() + 86400000).toISOString(), // Amanhã
          bookmakers: [{
            key: 'bookmaker1',
            markets: [{
              key: 'h2h',
              outcomes: [
                { name: 'Team A', price: 2.0 },
                { name: 'Team B', price: 3.0 },
                { name: 'draw', price: 3.5 }
              ]
            }]
          }]
        }
      ];

      const mockBasketballOdds = [
        {
          id: 'match2',
          sport_key: 'basketball',
          sport_title: 'Basketball',
          home_team: 'Team C',
          away_team: 'Team D',
          commence_time: new Date(Date.now() + 172800000).toISOString(), // Depois de amanhã
          bookmakers: [{
            key: 'bookmaker1',
            markets: [{
              key: 'h2h',
              outcomes: [
                { name: 'Team C', price: 1.8 },
                { name: 'Team D', price: 2.2 }
              ]
            }]
          }]
        }
      ];

      // Configurar mocks
      jest.spyOn(SportsService, 'getAllSports').mockResolvedValueOnce(mockSports);
      jest.spyOn(SportsService, 'getOddsForSport')
        .mockResolvedValueOnce(mockSoccerOdds)
        .mockResolvedValueOnce(mockBasketballOdds);

      // Executar o método
      const result = await SportsService.getUpcomingMatches();

      // Verificações
      expect(SportsService.getAllSports).toHaveBeenCalledWith('us');
      expect(SportsService.getOddsForSport).toHaveBeenCalledWith('soccer', 'us');
      expect(SportsService.getOddsForSport).toHaveBeenCalledWith('basketball', 'us');
      
      // Verificar o resultado
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('sportKey', 'soccer');
      expect(result[0]).toHaveProperty('homeTeam', 'Team A');
      expect(result[0]).toHaveProperty('odds.home', 2.0);
      expect(result[0]).toHaveProperty('odds.away', 3.0);
      expect(result[0]).toHaveProperty('odds.draw', 3.5);

      expect(result[1]).toHaveProperty('sportKey', 'basketball');
      expect(result[1]).toHaveProperty('homeTeam', 'Team C');
      expect(result[1]).toHaveProperty('odds.home', 1.8);
      expect(result[1]).toHaveProperty('odds.away', 2.2);
      expect(result[1]).toHaveProperty('odds.draw', null);
    });

    it('should handle errors when fetching upcoming matches', async () => {
      jest.spyOn(SportsService, 'getAllSports').mockRejectedValueOnce(new Error('API Error'));

      await expect(SportsService.getUpcomingMatches()).rejects.toThrow('Falha ao obter partidas futuras');
    });
  });

  describe('getBestOddsForEvent', () => {
    it('should find the best odds across bookmakers', async () => {
      // Mock para getEvent
      const mockEvent = {
        id: 'event1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        commenceTime: '2023-05-20T12:00:00Z',
        bookmakers: [
          {
            key: 'bookmaker1',
            title: 'Bookmaker 1',
            markets: [
              {
                key: 'h2h',
                outcomes: [
                  { name: 'Team A', price: 2.0 },
                  { name: 'Team B', price: 3.0 }
                ]
              }
            ]
          },
          {
            key: 'bookmaker2',
            title: 'Bookmaker 2',
            markets: [
              {
                key: 'h2h',
                outcomes: [
                  { name: 'Team A', price: 2.1 }, // Melhor odd para Team A
                  { name: 'Team B', price: 2.8 }  // Pior odd para Team B
                ]
              }
            ]
          }
        ]
      };

      jest.spyOn(SportsService, 'getEvent').mockResolvedValueOnce(mockEvent);

      const result = await SportsService.getBestOddsForEvent('soccer', 'event1');

      expect(SportsService.getEvent).toHaveBeenCalledWith('soccer', 'event1', 'us', 'h2h');
      expect(result).toHaveProperty('eventId', 'event1');
      expect(result).toHaveProperty('homeTeam', 'Team A');
      expect(result).toHaveProperty('awayTeam', 'Team B');
      expect(result.bestOdds['Team A'].price).toBe(2.1);
      expect(result.bestOdds['Team A'].bookmaker).toBe('Bookmaker 2');
      expect(result.bestOdds['Team B'].price).toBe(3.0);
      expect(result.bestOdds['Team B'].bookmaker).toBe('Bookmaker 1');
    });

    it('should throw an error if event is not found', async () => {
      jest.spyOn(SportsService, 'getEvent').mockResolvedValueOnce(null);

      await expect(SportsService.getBestOddsForEvent('soccer', 'nonexistent'))
        .rejects.toThrow('Evento não encontrado: nonexistent');
    });
  });
});
