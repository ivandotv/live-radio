import { getDbConnection } from 'lib/server/db-connection'
import { ApiContext } from 'lib/server/middleware'
import { RadioRepository } from 'lib/server/radio-repository'
import { radioAPIUserAgent } from 'lib/shared/config'
import { getSession } from 'next-auth/react'
import type { Koa } from 'nextjs-koa-api'
import { RadioBrowserApi } from 'radio-browser-api'
import { isProduction } from './config'

/**
 * Build request context
 */
export async function setupContextKoa(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const dbClient = await getDbConnection()

  ctx.radioRepository = new RadioRepository(dbClient)
  ctx.sessionCheck = getSession
  ctx.radioApi = new RadioBrowserApi(radioAPIUserAgent)
  ctx.info = {
    isProduction
  }

  await next()
}
