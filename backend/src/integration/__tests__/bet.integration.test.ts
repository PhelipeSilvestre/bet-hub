import request from 'supertest';
import { app } from '../../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL || process.env.DATABASE_URL, // Use DATABASE_TEST_URL se disponível
    },
  },
});

describe('Bet Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.create({
      data: {
        id: 'user1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        balance: 100,
      },
    });
  });

  afterAll(async () => {
    await prisma.bet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a bet', async () => {
    const response = await request(app)
      .post('/api/bets')
      .send({
        userId: 'user1',
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
