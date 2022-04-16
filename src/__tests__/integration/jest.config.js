/* eslint-disable @typescript-eslint/no-var-requires */
const parenConfig = require('../../../jest.config')

const currentPath = 'src/__tests__/integration'

module.exports = {
  ...parenConfig,
  projects: undefined,
  testEnvironment: 'node',
  name: 'integration',
  displayName: 'integration',
  rootDir: '../../../',
  testMatch: [`<rootDir>${currentPath}/**/?(*.)+(spec|test).[jt]s?(x)`],
  globalSetup: `<rootDir>${currentPath}/jestGlobalSetup.ts`,
  globalTeardown: `<rootDir>${currentPath}/jestGlobalTeardown.ts`
}
