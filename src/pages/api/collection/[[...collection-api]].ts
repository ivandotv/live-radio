import { setupContextKoa } from 'lib/server/api-context'
import { nodeEnv } from 'lib/server/config'
import { setupAsyncStorage } from 'lib/server/logger'
import {
  ApiContext,
  bulkValidateStations,
  checkCollectionExists,
  deleteCollection,
  getUserCollection,
  importStations,
  logError,
  setupSession
} from 'lib/server/middleware'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'

const api = new KoaApi<Koa.DefaultState, ApiContext>({
  koa: {
    env: nodeEnv
  },
  router: { prefix: '/api/collection' }
})

api.router
  .use(setupAsyncStorage, logError, setupContextKoa, setupSession)
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

export default withKoaApi(api)
