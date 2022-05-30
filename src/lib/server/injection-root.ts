import { ServerConfig, SERVER_CONFIG } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { RadioRepository } from 'lib/server/radio-repository'
import { SharedConfig, SHARED_CONFIG } from 'lib/shared/config'
import { getSession } from 'next-auth/react'
import { PumpIt, SCOPE, transform } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'
import { schemas } from './schemas'
import { logServerError } from './utils'

let container: PumpIt

export function getServerContainer() {
  if (!container) {
    container = new PumpIt()
      .bindValue(getSession, getSession)
      .bindValue('config', SERVER_CONFIG)
      .bindValue('sharedConfig', SHARED_CONFIG)
      .bindFactory(
        getDbConnection,
        {
          value: getDbConnection,
          inject: transform(['config'], (_, config: ServerConfig) => {
            return [
              {
                uri: config.mongoDb.uri,
                clientOptions: config.mongoDb.clientOptions
              }
            ]
          })
        },
        { scope: SCOPE.SINGLETON }
      )
      .bindClass(
        RadioBrowserApi,
        {
          value: RadioBrowserApi,
          inject: transform(['sharedConfig'], (_, config: SharedConfig) => {
            return [config.radioAPIUserAgent]
          })
        },
        { scope: SCOPE.CONTAINER_SINGLETON }
      )
      .bindClass(RadioRepository, RadioRepository)
      .bindValue(logServerError, logServerError)
      .bindValue(schemas, schemas)
  }

  return container
}
