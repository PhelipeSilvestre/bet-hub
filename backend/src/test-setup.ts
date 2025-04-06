// Global test setup/teardown for Jest

// Make sure to clean up any pending timers
afterEach(() => {
  jest.clearAllTimers();
});

// Make sure to clean up any mocks
afterEach(() => {
  jest.clearAllMocks();
});

// Detect open handles - useful for debugging
if (process.env.DEBUG_OPEN_HANDLES) {
  afterAll(() => {
    return new Promise(resolve => setTimeout(resolve, 500));
  });
}
