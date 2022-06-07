import {
  geolocation,
  getManifest,
  pickLocale,
  share
} from 'lib/server/api/misc/middleware'
import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
import { Router } from 'nextjs-koa-api'

//TODO - find better name
export function miscRouter() {
  return new Router<ApiState, ApiContext>()
    .get('/geolocation', geolocation)
    .get('/manifest', pickLocale, getManifest)
    .get('/share', pickLocale, share)
}
