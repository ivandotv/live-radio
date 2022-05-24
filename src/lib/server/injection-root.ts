import { isProduction, mongoDb } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { RadioRepository } from 'lib/server/radio-repository'
import { radioAPIUserAgent } from 'lib/shared/config'
import { getSession } from 'next-auth/react'
import { PumpIt, SCOPE } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'
import { logServerError } from './utils'

let injector: PumpIt

// function radioFactory(appName: string) {
//   return new RadioBrowserApi(appName)
// }

// radioFactory.inject = [RadioBrowserApi, radioAPIUserAgent]

export function getServerInjector() {
  if (!injector) {
    injector = new PumpIt()
      .bindValue(getSession, getSession)
      .bindValue('dbConfig', mongoDb)
      .bindValue('isProduction', isProduction)
      .bindValue(radioAPIUserAgent, radioAPIUserAgent)
      .bindFactory(
        getDbConnection,
        { value: getDbConnection, inject: ['dbConfig'] },
        { scope: SCOPE.SINGLETON }
      )
      .bindClass(
        RadioBrowserApi,
        { value: RadioBrowserApi, inject: [radioAPIUserAgent] },
        { scope: SCOPE.SINGLETON }
      )
      .bindClass(RadioRepository, RadioRepository, { scope: SCOPE.SINGLETON })
      .bindValue(logServerError, logServerError)
  }

  return injector
}
