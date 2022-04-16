import { AsyncLocalStorage } from 'async_hooks'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import pino from 'pino'
import { logLevel } from 'lib/server/config'
import { v4 as uuid } from 'uuid'
import { AppRequest } from 'lib/server/middleware'
import { getDbConnection } from 'lib/server/db-connection'
import { RadioRepository } from 'lib/server/radio-repository'
import { RadioBrowserApi } from 'radio-browser-api'
import { radioAPIUserAgent } from 'lib/shared/config'

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
export async function setupContext(
  req: AppRequest,
  _res: NextApiResponse,
  next: NextHandler
) {
  const child = originalLogger.child({})

  const client = await getDbConnection()
  const radioRepository = new RadioRepository(client)

  const radioApi = new RadioBrowserApi(radioAPIUserAgent)
  req.ctx = {
    radioRepository,
    radioApi
  }
  context.run(child, next)
}
