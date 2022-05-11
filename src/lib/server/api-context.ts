import { AsyncLocalStorage } from 'async_hooks'
import { logLevel } from 'lib/server/config'
import { getDbConnection } from 'lib/server/db-connection'
import { ApiContext } from 'lib/server/middleware'
import { RadioRepository } from 'lib/server/radio-repository'
import { radioAPIUserAgent } from 'lib/shared/config'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { Koa } from 'nextjs-koa-api'
import pino from 'pino'
import { RadioBrowserApi } from 'radio-browser-api'
import { v4 as uuid } from 'uuid'

/* SERVER Request Logger */
export const context = new AsyncLocalStorage<pino.Logger>()

const originalLogger = pino({
  level: logLevel
})

// Proxy logger instance to use child logger from the context if it exists
export const logger = new Proxy(originalLogger, {
  get(target, property, receiver) {
    target = context.getStore() || target

    return Reflect.get(target, property, receiver)
  }
})

export function withLogger(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const child = originalLogger.child({ requestId: uuid() })

    return context.run(child, () => handler(req, res))
  }
}

/**
 * Build request context
 */
export async function setupContextKoa(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const child = originalLogger.child({})

  const dbClient = await getDbConnection()

  ctx.radioRepository = new RadioRepository(dbClient)
  ctx.sessionCheck = getSession
  ctx.radioApi = new RadioBrowserApi(radioAPIUserAgent)

  // https://nodejs.org/api/async_context.html#usage-with-asyncawait
  await context.run(child, () => next())
}
