import { AsyncLocalStorage } from 'async_hooks'
import { SERVER_CONFIG } from 'lib/server/config'
import type { ApiContext } from 'lib/server/middleware/shared-middleware'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import type { Koa } from 'nextjs-koa-api'
import pino from 'pino'
import { v4 as uuid } from 'uuid'

/* SERVER Request Logger */
export const context = new AsyncLocalStorage<pino.Logger>()

const originalLogger = pino({
  level: SERVER_CONFIG.logLevel
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

export async function setupAsyncStorage(
  _ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const logger = originalLogger.child({})
  // https://nodejs.org/api/async_context.html#usage-with-asyncawait
  await context.run(logger, () => next())
}
