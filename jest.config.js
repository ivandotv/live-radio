module.exports = {
  projects: ['<rootDir>/src/__tests__/**'],
  setupFilesAfterEnv: ['./jestSetup.ts'],
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
