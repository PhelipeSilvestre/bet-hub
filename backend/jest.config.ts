export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  forceExit: true, // Force exit after all tests are complete
  detectOpenHandles: false, // Set to true to debug open handles
};
