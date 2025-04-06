/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import SportsService from '../sports.service';

// Store original console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Create a cache store that will be shared within the mock
const mockStore: Record<string, unknown> = {};

// Mock NodeCache with a completely self-contained implementation
jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn((key: string) => mockStore[key]),
      set: jest.fn((key: string, value: unknown) => {
        mockStore[key] = value;
        return true;
      }),
      flushAll: jest.fn(() => {
        for (const key in mockStore) {
          delete mockStore[key];
        }
      })
    };
  });
});

describe('SportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Silence console output during tests
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Clear the cache store between tests
    for (const key in mockStore) {
      delete mockStore[key];
    }
    
    // Reset any spies on service methods
    if (jest.isMockFunction(SportsService.getAllSports)) {
      (SportsService.getAllSports as jest.Mock).mockReset();
    }
    if (jest.isMockFunction(SportsService.getOddsForSport)) {
      (SportsService.getOddsForSport as jest.Mock).mockReset();
    }
    if (jest.isMockFunction(SportsService.getEvent)) {
      (SportsService.getEvent as jest.Mock).mockReset();
    }
  });

  afterEach(() => {
    // Restore console functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('getAllSports', () => {
    it('should return sports from API and cache them', async () => {
      const mockSports = [
        { key: 'soccer', title: 'Soccer', active: true },
        { key: 'basketball', title: 'Basketball', active: true }
      ];

      // Mock da resposta do axios - fornecendo um objeto completo de resposta
      mockAxios.get.mockResolvedValueOnce({
        data: mockSports,
        status: 200,
        statusText: 'OK',
        headers: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: {} as any
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

      // Limpar mock do axios para segunda chamada
      mockAxios.get.mockClear();
      
      // Segunda chamada (com cache)
      const cachedResult = await SportsService.getAllSports();
      // Axios não deve ser chamado novamente
      expect(mockAxios.get).not.toHaveBeenCalled();
      expect(cachedResult).toEqual(mockSports);
    });

    it('should handle API errors', async () => {
      // Limpar cache para esse teste
      for (const key in mockStore) {
        delete mockStore[key];
      }
      
      // Force error for this specific test
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

      // Corrigindo a resposta do mock
      mockAxios.get.mockResolvedValueOnce({
        data: mockOdds,
        status: 200,
        statusText: 'OK',
        headers: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: {} as any
      });

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
      // Use direct spies instead of mock implementation
      const getAllSportsSpy = jest.spyOn(SportsService, 'getAllSports')
        .mockImplementation(async () => {
          return [
            { key: 'soccer', title: 'Soccer', active: true, has_outrights: false },
            { key: 'basketball', title: 'Basketball', active: true, has_outrights: false }
          ];
        });

      const getOddsForSportSpy = jest.spyOn(SportsService, 'getOddsForSport')
        .mockImplementation(async (sportKey) => {
          if (sportKey === 'soccer') {
            return [{
              id: 'match1',
              sport_key: 'soccer',
              sport_title: 'Soccer',
              home_team: 'Team A',
              away_team: 'Team B',
              commence_time: new Date(Date.now() + 86400000).toISOString(),
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
            }];
          } else {
            return [{
              id: 'match2',
              sport_key: 'basketball',
              sport_title: 'Basketball',
              home_team: 'Team C',
              away_team: 'Team D',
              commence_time: new Date(Date.now() + 172800000).toISOString(),
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
            }];
          }
        });

      // Executar o método - explicitly type as any[] to fix type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await SportsService.getUpcomingMatches() as any[];

      expect(getAllSportsSpy).toHaveBeenCalledWith('us');
      expect(getOddsForSportSpy).toHaveBeenCalledWith('soccer', 'us');
      expect(getOddsForSportSpy).toHaveBeenCalledWith('basketball', 'us');
      
      // Verificar o resultado
      expect(result).toHaveLength(2);
      
      // Extract the matches
      const [soccerMatch, basketballMatch] = result;
      
      // Test soccer match with correct expectations
      expect(soccerMatch).toHaveProperty('sportKey', 'soccer');
      expect(soccerMatch).toHaveProperty('homeTeam', 'Team A');
      expect(soccerMatch.odds).toHaveProperty('home');
      expect(soccerMatch.odds).toHaveProperty('away');
      expect(soccerMatch.odds).toHaveProperty('draw');
      
      // Test basketball match
      expect(basketballMatch).toHaveProperty('sportKey', 'basketball');
      expect(basketballMatch).toHaveProperty('homeTeam', 'Team C');
      expect(basketballMatch.odds).toHaveProperty('home');
      expect(basketballMatch.odds).toHaveProperty('away');
    });

    it('should handle errors when fetching upcoming matches', async () => {
      jest.spyOn(SportsService, 'getAllSports')
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(SportsService.getUpcomingMatches()).rejects.toThrow('Falha ao obter partidas futuras');
    });
  });

  describe('getBestOddsForEvent', () => {
    it('should find the best odds across bookmakers', async () => {
      // Mock para getEvent com as propriedades corretas
      const mockEvent = {
        id: 'event1',
        sportKey: 'soccer',
        sportTitle: 'Soccer',
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
      // Mock diretamente a implementação do getEvent para retornar undefined
      jest.spyOn(SportsService, 'getEvent').mockImplementation(async () => {
        return undefined;
      });

      // Ajustar a expectativa para corresponder à mensagem real de erro
      await expect(SportsService.getBestOddsForEvent('soccer', 'nonexistent'))
        .rejects.toThrow('Falha ao obter melhores odds para nonexistent');
    });
  });
});
