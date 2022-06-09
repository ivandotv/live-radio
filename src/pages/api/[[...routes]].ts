import koaBody from 'koa-body'
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
import { ServerError } from 'lib/server/server-error'
import { attachRouter, Koa, KoaApi, withKoaApi } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'
export function handler(container: PumpIt) {
  const api = new KoaApi<Koa.DefaultState, ApiContext>({
    koa: {
      env: container.resolve<ServerConfig>('config').env
    },
    attachBody: false
  })

  api
    .use(buildContext(container))
    .use(handleServerError)
    .use(
      koaBody({
        jsonLimit: '1mb',
        onError: (err) => {
          throw new ServerError({
            body: { msg: err.message },
            status: 400,
            diagnostics: {
              error: err
            }
          })
        }
      })
    )

  attachRouter('/api', api, miscRouter())
  attachRouter('/api/collection', api, collectionRouter())
  attachRouter('/api/station', api, stationRouter())

  return api
}

export default withKoaApi(handler(getServerContainer()))
