import { setupContextKoa } from 'lib/server/api-context'
import {
  ApiContext,
  checkCollectionExists,
  deleteStation,
  saveStation,
  setupSession,
  validateStation
} from 'lib/server/middleware'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'

const api = new KoaApi<Koa.DefaultState, ApiContext>({
  router: { prefix: '/api/station' }
})

api.router
  .use(setupContextKoa, setupSession)
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
