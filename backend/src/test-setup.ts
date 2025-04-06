// Global test setup/teardown for Jest
import { PrismaClient } from '@prisma/client';

// Make sure to clean up any pending timers
afterEach(() => {
  jest.clearAllTimers();
});

// Make sure to clean up any mocks
afterEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests are complete
afterAll(async () => {
  // Disconnect Prisma client
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  
  // Ensure any event emitters are closed
  process.removeAllListeners();
});

// Detect open handles - useful for debugging
if (process.env.DEBUG_OPEN_HANDLES) {
  afterAll(() => {
    return new Promise(resolve => setTimeout(resolve, 500));
  });
}
