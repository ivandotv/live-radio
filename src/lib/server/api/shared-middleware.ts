import { ServerConfig } from 'lib/server/config'
import { RadioRepository } from 'lib/server/radio-repository'
import {
  countryDataByKey,
  fetchIpInfo,
  getSongInfo,
  logServerError,
  ServerError
} from 'lib/server/utils'
import { SharedConfig } from 'lib/shared/config'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { Koa } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'
import requestIp from 'request-ip'
import { schemas } from '../schemas'

export interface ApiContext extends Koa.DefaultContext {
  deps: {
    config: ServerConfig
    sharedConfig: SharedConfig
    getSession: typeof getSession
    radioRepository: RadioRepository
    radioApi: RadioBrowserApi
    logServerError: ReturnType<typeof logServerError>
    getSongInfo: typeof getSongInfo
    schemas: typeof schemas
    requestIp: typeof requestIp
    countryDataByKey: typeof countryDataByKey
    fetchIpInfo: typeof fetchIpInfo
  }
}

export interface ApiState extends Koa.DefaultState {
  session?: Session
}

/**
 * Builds Koa context
 * @param container  - injection container with context dependencies
 */
export function buildContext(container: PumpIt) {
  return async (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
    next: Koa.Next
  ) => {
    ctx.deps = {
      config: container.resolve<ServerConfig>('config'),
      sharedConfig: container.resolve<SharedConfig>('sharedConfig'),
      radioRepository: container.resolve<RadioRepository>(RadioRepository),
      getSession: container.resolve<typeof getSession>(getSession),
      radioApi: container.resolve<RadioBrowserApi>(RadioBrowserApi),
      logServerError:
        container.resolve<ReturnType<typeof logServerError>>(logServerError),
      schemas: container.resolve<typeof schemas>(schemas),
      getSongInfo: container.resolve<typeof getSongInfo>(getSongInfo),
      requestIp: container.resolve<typeof requestIp>(requestIp),
      fetchIpInfo: container.resolve<typeof fetchIpInfo>(fetchIpInfo),
      countryDataByKey:
        container.resolve<typeof countryDataByKey>(countryDataByKey)
    }

    return next()
  }
}

/**
 * Check if user is authenticated
 */
export async function checkSession(
  ctx: Koa.ParameterizedContext<ApiState, ApiContext>,
  next: Koa.Next
) {
  const { getSession } = ctx.deps
  const session = await getSession({ req: ctx.req })
  if (!session) {
    ctx.status = 401
    ctx.body = { msg: 'Unauthorized' }

    return
  } else {
    ctx.state.session = session
  }

  return next()
}

/**
 * Logs error
 */
export async function handleServerError(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  try {
    await next()
  } catch (err: unknown) {
    const { logServerError, config } = ctx.deps

    const defaultMessage = 'Internal server error'
    let status = 500
    let exposeError = false
    let logIt = true
    let payload: string | Record<string, any> | null = defaultMessage

    if (err instanceof ServerError) {
      status = err.status
      logIt = err.logIt
      if (err.body) {
        exposeError = true
        payload = err.body
      }
    }

    if (!ctx.headerSent) {
      ctx.status = status
      ctx.body = config.isProduction
        ? exposeError
          ? payload
          : defaultMessage
        : defaultMessage
    }

    if (logIt) {
      logServerError(err, ctx)
    }
  }
}
