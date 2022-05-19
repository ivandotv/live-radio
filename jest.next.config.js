/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require('next/jest')
const jestConfig = require('./jest.config')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

module.exports = createJestConfig(jestConfig)
