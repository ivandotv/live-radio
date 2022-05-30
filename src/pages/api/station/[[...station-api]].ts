import { ServerConfig } from 'lib/server/config'
import { getServerContainer } from 'lib/server/injection-root'
import {
  ApiContext,
  buildCtx,
  checkCollectionExists,
  checkSession,
  logError
} from 'lib/server/middleware/shared'
import {
  bulkStationInfo,
  deleteStation,
  saveStation,
  validateStation
} from 'lib/server/middleware/station'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'

export function handler(container: PumpIt) {
  const api = new KoaApi<Koa.DefaultState, ApiContext>({
    koa: {
      env: container.resolve<ServerConfig>('config').nodeEnv
    },
    router: { prefix: '/api/station' }
  })
  api.router
    .use(buildCtx(container), logError)
    // https://github.com/koajs/router/issues/95
    .post('/batch/info', bulkStationInfo)
    .post<
      Koa.DefaultState,
      ApiContext & {
        request: {
          body: {
            stations: RadioDTO[]
          }
          params: {
            collection: StationCollection
          }
        }
      }
    >(
      '/:collection',
      checkSession,
      checkCollectionExists,
      validateStation,
      saveStation
    )
    .delete('/:collection', checkSession, checkCollectionExists, deleteStation)
  // .get('/info') //TODO - get station info

  return api
}

export default withKoaApi(handler(getServerContainer()))
