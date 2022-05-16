// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

const customJestConfig = {
  // projects: ['<rootDir>/src/__tests__/**'],
  setupFilesAfterEnv: ['./jestSetup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  globals: {
    __DEV__: false,
    __VERSION__: 'jest-version',
    __BUILD_DATE__: 'jest-build-date',
    __COMMIT_SHA__: 'jest-commit-sha'
  },
  collectCoverageFrom: [
    './src/**',
    '!./src/index.ts',
    '!./src/types.ts',
    '!./src/**.d.ts',
    '!./src/__tests__/**',
    '!./src/__fixtures__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}

module.exports = createJestConfig(customJestConfig)
