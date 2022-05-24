import { nodeEnv } from 'lib/server/config'
import { getServerInjector } from 'lib/server/injection-root'
import {
  ApiContext,
  buildCtx,
  bulkValidateStations,
  checkCollectionExists,
  checkSession,
  deleteCollection,
  getUserCollection,
  importStations,
  logError
} from 'lib/server/middleware'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'

export function handler(container: PumpIt) {
  const api = new KoaApi<Koa.DefaultState, ApiContext>({
    koa: {
      env: nodeEnv
    },
    router: { prefix: '/api/collection' }
  })

  api.router
    .use(buildCtx(container), logError, checkSession)
    .get<
      Koa.DefaultState,
      ApiContext & {
        request: {
          params: {
            collection: StationCollection
          }
        }
      }
    >('/:collection', checkCollectionExists, getUserCollection)
    .post<
      Koa.DefaultState,
      {
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
      '/:collection/import',
      checkCollectionExists,
      bulkValidateStations,
      importStations
    )
    .delete('/:collection', checkCollectionExists, deleteCollection)

  return api
}

export default withKoaApi(handler(getServerInjector()))
