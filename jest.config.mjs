import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)+(test|spec).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!src/types/**',
    '!src/styles/**',
    '!src/test-utils/**',
    '!src/i18n/**',
    '!src/config/**',
    '!**/index.ts',
    '!**/index.tsx',
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};

const baseConfigFn = createJestConfig(customConfig);

export default async function jestConfig() {
  const config = await baseConfigFn();
  config.transformIgnorePatterns = [
    '/node_modules/(?!(next-intl|use-intl|@formatjs|intl-messageformat|@vercel/analytics|@vercel/speed-insights)/).*',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
}
