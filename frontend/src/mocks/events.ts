import { Event } from '@/components/EventCard';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Flamengo vs Fluminense',
    date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    sport: 'Futebol',
    teams: {
      home: 'Flamengo',
      away: 'Fluminense'
    },
    odds: {
      home: 1.85,
      draw: 3.40,
      away: 4.50
    }
  },
  {
    id: '2',
    title: 'Santos vs Corinthians',
    date: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    sport: 'Futebol',
    teams: {
      home: 'Santos',
      away: 'Corinthians'
    },
    odds: {
      home: 2.10,
      draw: 3.20,
      away: 3.60
    }
  },
  {
    id: '3',
    title: 'Botafogo vs Vasco',
    date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    sport: 'Futebol',
    teams: {
      home: 'Botafogo',
      away: 'Vasco'
    },
    odds: {
      home: 2.00,
      draw: 3.30,
      away: 3.75
    }
  },
  {
    id: '4',
    title: 'Brasil vs Argentina',
    date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    sport: 'Futebol',
    teams: {
      home: 'Brasil',
      away: 'Argentina'
    },
    odds: {
      home: 2.20,
      draw: 3.10,
      away: 3.40
    }
  },
  {
    id: '5',
    title: 'Lakers vs Warriors',
    date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    sport: 'Basquete',
    teams: {
      home: 'Los Angeles Lakers',
      away: 'Golden State Warriors'
    },
    odds: {
      home: 1.90,
      away: 1.95
    }
  },
  {
    id: '6',
    title: 'Novak Djokovic vs Rafael Nadal',
    date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    sport: 'Tênis',
    teams: {
      home: 'Novak Djokovic',
      away: 'Rafael Nadal'
    },
    odds: {
      home: 1.75,
      away: 2.10
    }
  }
];

