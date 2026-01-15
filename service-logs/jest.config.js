module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'app.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  maxWorkers: 1
};

