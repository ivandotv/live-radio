import { type } from 'node:os'
import { GenericContainer } from 'testcontainers'
import timeSpan from 'time-span'

export async function initializeMongo() {
  const remoteContainers =
    Boolean(process.env.REMOTE_CONTAINERS) || Boolean(process.env.CODESPACES)
  const newtworkAlias = 'mongo-test-db'

  console.log('check remote containers ', remoteContainers)

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
