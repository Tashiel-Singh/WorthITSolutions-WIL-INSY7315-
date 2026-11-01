module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  transform: { '^.+\\.ts$': ['ts-jest', { isolatedModules: true }] },
  collectCoverageFrom: ['src/services/**/*.ts', 'src/lib/money.ts', 'src/lib/security.ts'],
  coverageThreshold: { global: { statements: 80, branches: 70, functions: 80, lines: 80 } },
};
