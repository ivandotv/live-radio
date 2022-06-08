import { collectionRouter } from 'lib/server/api/collection/routes'
import { miscRouter } from 'lib/server/api/misc/routes'
import {
  ApiContext,
  buildContext,
  handleServerError
} from 'lib/server/api/shared-middleware'
import { stationRouter } from 'lib/server/api/station/routes'
import { ServerConfig } from 'lib/server/config'
import { getServerContainer } from 'lib/server/injection-root'
import { attachRouter, Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'

export function handler(container: PumpIt) {
  const api = new KoaApi<Koa.DefaultState, ApiContext>({
    koa: {
      env: container.resolve<ServerConfig>('config').env
    }
  })

  api.use(buildContext(container)).use(handleServerError)

  attachRouter('/api', api, miscRouter())
  attachRouter('/api/collection', api, collectionRouter())
  attachRouter('/api/station', api, stationRouter())

  return api
}

export default withKoaApi(handler(getServerContainer()))
