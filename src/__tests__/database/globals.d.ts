/* eslint-disable no-var */
import { StartedTestContainer } from 'testcontainers'

declare global {
  var containers: StartedTestContainer[]
}
