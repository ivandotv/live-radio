import { ServerConfig, SERVER_CONFIG } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { RadioRepository } from 'lib/server/radio-repository'
import { countryDataByKey, fetchIpInfo } from 'lib/server/utils'
import { SharedConfig, SHARED_CONFIG } from 'lib/shared/config'
import { getSession } from 'next-auth/react'
import pino from 'pino'
import { PumpIt, SCOPE, transform } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'
import requestIp from 'request-ip'
import { schemas } from './schemas'
import { getSongInfo, logServerError } from './utils'

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
      .bindFactory(logServerError, logServerError, {
        scope: SCOPE.CONTAINER_SINGLETON
      })
      .bindFactory(
        'logger',
        {
          value: (config: ServerConfig) => {
            return pino({
              level: config.logLevel
            })
          },
          inject: ['config']
        },
        { scope: SCOPE.CONTAINER_SINGLETON }
      )
      .bindValue(schemas, schemas)
      .bindValue(getSongInfo, getSongInfo)
      .bindValue(requestIp, requestIp)
      .bindValue(countryDataByKey, countryDataByKey)
      .bindValue(fetchIpInfo, fetchIpInfo)
  }

  return container
}
