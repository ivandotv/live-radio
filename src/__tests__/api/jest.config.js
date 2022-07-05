// const parenConfig = require('../database/jest.config')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parenConfig = require('../../../jest.config')
//NOTE: using global setup , and global teardown from the "database" project
const currentPath = 'src/__tests__/api'

module.exports = {
  ...parenConfig,
  displayName: 'api',
  rootDir: '../../../',
  setupFiles: ['<rootDir>/jestSetup.ts'],
  testMatch: [`<rootDir>${currentPath}/**/?(*.)+(spec|test).[jt]s?(x)`],
  globalSetup: `<rootDir>${currentPath}/../database/jestGlobalSetup.ts`,
  globalTeardown: `<rootDir>${currentPath}/../database/jestGlobalTeardown.ts`
}
