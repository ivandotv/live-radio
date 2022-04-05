import { AsyncLocalStorage } from 'async_hooks'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import pino from 'pino'
import { logLevel } from 'server-config'
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
 * Enable logger for connect middleware
 */
export function setupLogger(
  _req: NextApiRequest,
  _res: NextApiResponse,
  next: NextHandler
) {
  const child = originalLogger.child({})
  context.run(child, next)
}
