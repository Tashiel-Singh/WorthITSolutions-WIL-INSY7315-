module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s'],
  testPathIgnorePatterns: ['\\.d\\.ts$'],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
  },
};