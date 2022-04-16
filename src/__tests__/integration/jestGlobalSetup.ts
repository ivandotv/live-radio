import { GenericContainer } from 'testcontainers'
import { type } from 'os'

global.containers = []

let firstRun = true

module.exports = async (_config: any) => {
  if (firstRun) {
    console.log('\nGlobal setup started')

    const containerBuilder = new GenericContainer(
      'mongo:5.0.7'
    ).withExposedPorts(27017)

    if (type() === 'Linux') {
      console.log('mongo: using tmpsf mount')
      containerBuilder.withTmpFs({ '/data/db': '' })
    }

    const startedContainer = await startContainer(containerBuilder, 'mongo')

    process.env.MONGO_PORT = startedContainer.getMappedPort(
      27017
    ) as unknown as string

    global.containers.push(startedContainer)

    console.log('Global setup done')
  }

  firstRun = false
}

async function startContainer(
  containerBuilder: GenericContainer,
  name: string
) {
  const label = `${name} container started in`

  console.log(`starting ${name} container`)
  console.time(label)

  const startedContainer = await containerBuilder.start()

  console.timeEnd(label)

  return startedContainer
}
