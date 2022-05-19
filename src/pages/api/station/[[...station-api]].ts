import { setupContextKoa } from 'lib/server/api-context'
import { nodeEnv } from 'lib/server/config'
import { setupAsyncStorage } from 'lib/server/logger'
import {
  ApiContext,
  checkCollectionExists,
  deleteStation,
  logError,
  saveStation,
  checkSession,
  validateStation
} from 'lib/server/middleware'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'

const api = new KoaApi<Koa.DefaultState, ApiContext>({
  koa: {
    env: nodeEnv
  },
  router: { prefix: '/api/station' }
})

api.router
  .use(setupAsyncStorage, logError, setupContextKoa, checkSession)
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
  >('/:collection', checkCollectionExists, validateStation, saveStation)
  .delete('/:collection', checkCollectionExists, deleteStation)

export default withKoaApi(api)
