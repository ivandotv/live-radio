import {
  geolocation,
  manifest,
  pickLocale,
  share
} from 'lib/server/api/misc/middleware'
import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
import { Router } from 'nextjs-koa-api'

export const misc = new Router<ApiState, ApiContext>()
  .get('/geolocation', geolocation)
  .get('/manifest', pickLocale, manifest)
  .get('/share', pickLocale, share)
