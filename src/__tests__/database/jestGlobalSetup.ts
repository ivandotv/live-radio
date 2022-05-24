import dotenv from 'dotenv'
import { type } from 'node:os'
import { resolve } from 'node:path'
import { GenericContainer } from 'testcontainers'
import timeSpan from 'time-span'

dotenv.config({ path: resolve(__dirname, '../../../.env.local') })

global.containers = []

let firstRun = true

export default async function jestGlobalSetup(_config: any) {
  process.env.JEST_FIRST_RUN = firstRun ? 'yes' : 'no'

  process.env.MONGO_DB_URI = 'not_used'
  process.env.MONGO_DB_NAME = 'not_used'

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

async function initializeMongo() {
  const newtworkAlias = 'mongo-test-db'
  const mongoContainer = new GenericContainer('mongo:5.0.7')
    .withExposedPorts(27017)
    .withNetworkMode('live-radio_default')
    .withNetworkAliases(newtworkAlias)

  if (type() === 'Linux') {
    console.log('mongo: using tmpfs mount')
    mongoContainer.withTmpFs({ '/data/db': '' })
  }

  const mongoStarted = await startContainer(mongoContainer, 'mongo')

  const remoteContainers = Boolean(process.env.REMOTE_CONTAINERS)

  console.log('remote contianers ', remoteContainers)
  process.env.MONGO_HOST = remoteContainers ? newtworkAlias : 'localhost'

  process.env.MONGO_PORT = remoteContainers
    ? '27017'
    : (mongoStarted.getMappedPort(27017) as unknown as string)

  return mongoStarted
}

async function startContainer(
  containerBuilder: GenericContainer,
  name: string
) {
  const end = timeSpan()
  const startedContainer = await containerBuilder.start()

  console.log(`${name} started in: ${end.seconds()} seconds`)

  return startedContainer
}
