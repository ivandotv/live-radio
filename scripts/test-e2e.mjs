import { type } from 'node:os'
import { GenericContainer } from 'testcontainers'
import { $ } from 'zx'
import 'zx/globals'
;(async function main() {
  //disable automatic cleanup of test containers
  process.env.TESTCONTAINERS_RYUK_DISABLED = true
  let mongoContainer
  let server
  let hasError = false
  try {
    mongoContainer = await startMongo()

    process.env.NODE_ENV = 'test'
    process.env.E2E = 'true'

    server = $`pnpm start`

    await $`pnpm cypress run --browser chrome`
  } catch (e) {
    hasError = true
  } finally {
    if (mongoContainer) {
      console.log('stopping mongo')
      await mongoContainer.stop()
      console.log('mongo stopped')
    }
    if (server) {
      console.log('stopping server')
      await server.kill()
      console.log('server stopped')
    }

    process.exit(hasError ? 1 : 0)
  }
})()

async function startMongo() {
  const remoteContainers =
    Boolean(process.env.REMOTE_CONTAINERS) || Boolean(process.env.CODESPACES)
  const newtworkAlias = 'mongo-test-db'

  const mongoContainer = new GenericContainer('mongo:5.0.8').withExposedPorts(
    27017
  )

  console.log('using remote containers: ', remoteContainers)

  if (type() === 'Linux') {
    console.log('mongo: using tmpfs mount')
    mongoContainer.withTmpFs({ '/data/db': '' })
  }
  if (remoteContainers) {
    mongoContainer
      .withNetworkMode('development')
      .withNetworkAliases(newtworkAlias)
  }

  const mongoStarted = await mongoContainer.start()

  const host = remoteContainers ? newtworkAlias : 'localhost'

  const port = remoteContainers ? '27017' : mongoStarted.getMappedPort(27017)

  process.env.MONGO_DB_URI = `mongodb://${host}:${port}`

  console.log('mongo db started')
  console.log('MONGO_DB_URI: ', process.env.MONGO_DB_URI)

  return mongoStarted
}
