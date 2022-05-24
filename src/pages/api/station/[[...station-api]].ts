import { nodeEnv } from 'lib/server/config'
import { getServerInjector } from 'lib/server/injection-root'
import {
  ApiContext,
  buildCtx,
  checkCollectionExists,
  checkSession,
  deleteStation,
  logError,
  saveStation,
  validateStation
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
    router: { prefix: '/api/station' }
  })
  api.router
    .use(buildCtx(container), logError, checkSession)
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

  return api
}

export default withKoaApi(handler(getServerInjector()))
