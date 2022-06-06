import { collection } from 'lib/server/api/collection/routes'
import { misc } from 'lib/server/api/misc/routes'
import {
  ApiContext,
  buildContext,
  handleServerError
} from 'lib/server/api/shared-middleware'
import { station } from 'lib/server/api/station/routes'
import { ServerConfig } from 'lib/server/config'
import { getServerContainer } from 'lib/server/injection-root'
import { attachRouter, Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'

export function handler(container: PumpIt) {
  const api = new KoaApi<Koa.DefaultState, ApiContext>({
    koa: {
      env: container.resolve<ServerConfig>('config').nodeEnv
    }
  })

  api.use(buildContext(container)).use(handleServerError)

  attachRouter('/api', api, misc)
  attachRouter('/api/collection', api, collection)
  attachRouter('/api/station', api, station)

  return api
}

export default withKoaApi(handler(getServerContainer()))
