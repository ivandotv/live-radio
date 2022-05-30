import { ServerConfig } from 'lib/server/config'
import { RadioRepository } from 'lib/server/radio-repository'
import { logServerError } from 'lib/server/utils'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { Koa } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'
import { schemas } from '../schemas'

export interface ApiContext extends Koa.DefaultContext {
  session?: Session
  sessionCheck: typeof getSession
  radioRepository: RadioRepository
  radioApi: RadioBrowserApi
  logServerError: typeof logServerError
  schemas: typeof schemas
  info: {
    isProduction: boolean
  }
}

/** Build koa api context*/
export function buildCtx(container: PumpIt) {
  return async (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
    next: Koa.Next
  ) => {
    ctx.radioRepository = container.resolve<RadioRepository>(RadioRepository)
    ctx.sessionCheck = container.resolve<typeof getSession>(getSession)
    ctx.radioApi = container.resolve<RadioBrowserApi>(RadioBrowserApi)
    ctx.logServerError =
      container.resolve<typeof logServerError>(logServerError)
    ctx.info = {
      isProduction: container.resolve<ServerConfig>('config').isProduction
    }
    ctx.schemas = container.resolve<typeof schemas>(schemas)
    await next()
  }
}

/**
 * Check if user is authenticated
 */
export async function checkSession(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const session = await getSession({ req: ctx.req })
  if (!session) {
    ctx.status = 401
    ctx.body = { msg: 'Unauthorized' }

    return
  } else {
    ctx.session = session
  }

  await next()
}

/**
 * Logs error
 */
export async function logError(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  try {
    await next()
  } catch (err: any) {
    err.status = err.statusCode || err.status || 500

    ctx.logServerError(
      err,
      {
        tags: {
          endpoint: ctx.endpoint
        }
      },
      ctx.url
    )

    ctx.status = err.status
    ctx.body = ctx.info.isProduction ? 'internal server error' : err.message

    ctx.app.emit('error', err, ctx)
  }
}

/**
 * Check if collection exists
 */

export async function checkCollectionExists(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const collectionName = ctx.params.collection

  if (!collectionName) {
    ctx.response.status = 400
    ctx.body = { msg: 'collection name required' }

    return
  } else if (-1 === ['favorites', 'recent'].indexOf(collectionName)) {
    ctx.response.status = 404
    ctx.body = { msg: 'collection not found' }

    return
  }
  await next()
}
