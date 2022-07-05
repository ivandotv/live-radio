import timeSpan from 'time-span'
import '../jestGlobalSetupShared'
import { initializeMongo } from '../__utils__/docker-utils'

global.containers = []

let firstRun = true

export default async function jestGlobalSetup(_config: any) {
  process.env.JEST_FIRST_RUN = firstRun ? 'yes' : 'no'

  if (firstRun) {
    console.log('\nsetup started')
    const end = timeSpan()

    const mongoContainer = initializeMongo()

    const startedContainers = await Promise.all([mongoContainer])

    global.containers.push(...startedContainers)

    console.log(`setup done in: ${end.seconds()} seconds`)
  }

  firstRun = false
}
