import * as Sentry from '@sentry/nextjs'
import { ServerConfig } from 'lib/server/config'
import { getServerContainer } from 'lib/server/injection-root'
import { SharedConfig } from 'lib/shared/config'
import { merge } from 'lodash'
import { PumpIt } from 'pumpit'
import { DeepPartial } from 'ts-essentials'

/** PRACTICE: create child container from the original container*/
const container = getServerContainer()
const originalConfig = container.resolve<ServerConfig>('config')

const testConfig: DeepPartial<ServerConfig> = {
  mongoDb: {
    dbName: `test_db_${process.env.JEST_WORKER_ID}`
  }
}

const defaultTestContainer = container
  .child()
  .bindValue('config', merge(originalConfig, testConfig))

export function createTestContainer(
  serverConfig?: DeepPartial<ServerConfig>,
  sharedConfig?: DeepPartial<SharedConfig>,
  parentContainer?: PumpIt
) {
  const child = parentContainer?.child() || defaultTestContainer.child()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  child.bindValue(Sentry, { captureException: () => {} })

  if (serverConfig) {
    child.bindValue(
      'config',
      merge(
        {},
        defaultTestContainer.resolve<ServerConfig>('config'),
        serverConfig
      )
    )
  }
  if (sharedConfig) {
    child.bindValue(
      'sharedConfig',
      merge(
        {},
        defaultTestContainer.resolve<SharedConfig>('sharedConfig'),
        sharedConfig
      )
    )
  }

  return child
}
