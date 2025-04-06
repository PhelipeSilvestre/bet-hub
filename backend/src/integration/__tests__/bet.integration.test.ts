import { Server } from 'http'; // Import Server type
import request from 'supertest';
import { app } from '../../server'; 
import { Request } from 'express';



// Mock the entire Prisma client
jest.mock('@prisma/client', () => {
  return { 
    PrismaClient: jest.fn(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user1',
          balance: 100,
        }),
        update: jest.fn().mockResolvedValue({
          id: 'user1',
          balance: 50,
        }),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      bet: {
        create: jest.fn().mockResolvedValue({
          id: 'bet1',
          userId: 'user1',
          eventId: 'event1',
          amount: 50,
          odds: 2.0,
          potentialPayout: 100,
          sport: 'football',
          status: 'PENDING',
        }),
        findMany: jest.fn().mockResolvedValue([
          { id: 'bet1', userId: 'user1', amount: 50 }
        ]),
        deleteMany: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    }))
  };
});

// Mock the auth middleware to bypass authentication
jest.mock('../../middlewares/auth.middleware', () => ({
  authenticate: (req: Request, res: Response, next: () => void) => {
    req.userId = 'user1'; // Set mock user ID
    next();
  }
}));

// Declare the server variable
let server: Server;

describe('Bet Integration Tests', () => {
  // Setup before tests run
  beforeAll((done) => {
    // Start the server and assign it to the global variable
    server = app.listen(4000, () => {
      console.log('Test server running on port 4000');
      done();
    });
  });

  // Cleanup after tests are done
  afterAll((done) => {
    // Close the server to release resources
    if (server) server.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  it('should create a bet', async () => {
    const response = await request(app)
      .post('/api/bets')
      .send({
        eventId: 'event1',
        amount: 50,
        odds: 2.0,
        sport: 'football',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.potentialPayout).toBe(100);
  });

  it('should return a list of bets for a user', async () => {
    const response = await request(app).get('/api/bets/user/user1');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
