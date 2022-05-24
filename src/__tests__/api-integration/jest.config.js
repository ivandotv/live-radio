// const parenConfig = require('../database/jest.config')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parenConfig = require('../../../jest.config')
//NOTE: using global setup , and global teardown from the "database" project
const currentPath = 'src/__tests__/api-integration'

module.exports = {
  ...parenConfig,
  displayName: 'integration',
  rootDir: '../../../',
  setupFiles: [`<rootDir>${currentPath}/jestSetup.ts`],
  testMatch: [`<rootDir>${currentPath}/**/?(*.)+(spec|test).[jt]s?(x)`]
}
