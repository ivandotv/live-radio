// eslint-disable-next-line @typescript-eslint/no-var-requires
const parenConfig = require('../../../jest.config')

const currentPath = 'src/__tests__/database'

module.exports = {
  ...parenConfig,
  projects: undefined,
  displayName: 'database',
  rootDir: '../../../',
  testMatch: [`<rootDir>${currentPath}/**/?(*.)+(spec|test).[jt]s?(x)`],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jestSetup.ts'],
  globalSetup: `<rootDir>${currentPath}/jestGlobalSetup.ts`,
  globalTeardown: `<rootDir>${currentPath}/jestGlobalTeardown.ts`
}
