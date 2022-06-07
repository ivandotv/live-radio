import { type } from 'node:os'
import { GenericContainer } from 'testcontainers'
import timeSpan from 'time-span'

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

async function initializeMongo() {
  const remoteContainers =
    Boolean(process.env.REMOTE_CONTAINERS) || Boolean(process.env.CODESPACES)
  const newtworkAlias = 'mongo-test-db'

  const mongoContainer = new GenericContainer('mongo:5.0.8').withExposedPorts(
    27017
  )

  if (type() === 'Linux') {
    console.log('mongo: using tmpfs mount')
    mongoContainer.withTmpFs({ '/data/db': '' })
  }
  if (remoteContainers) {
    mongoContainer
      .withNetworkMode('development')
      .withNetworkAliases(newtworkAlias)
  }

  const mongoStarted = await startContainer(mongoContainer, 'mongo')

  const host = remoteContainers ? newtworkAlias : 'localhost'

  const port = remoteContainers
    ? '27017'
    : (mongoStarted.getMappedPort(27017) as unknown as string)

  process.env.MONGO_DB_URI = `mongodb://${host}:${port}`

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
