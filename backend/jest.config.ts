export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  forceExit: true, // Force exit after all tests are complete
  detectOpenHandles: true, // Enable this temporarily to identify the issue
  // Add a timeout to give processes time to close
  testTimeout: 15000,
};
