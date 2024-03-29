const customJestConfig = {
  // projects: ['<rootDir>/src/__tests__/**'],
  projects: ['<rootDir>/src/__tests__/database', '<rootDir>/src/__tests__/api'],
  setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  // testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  // },
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

module.exports = customJestConfig
