import {
  validateCollectionPayload,
  deleteCollection,
  getUserCollection,
  importStations,
  validateImportStations
} from 'lib/server/api/collection/middleware'
import { ApiContext, checkSession } from 'lib/server/api/shared-middleware'
import { Koa, Router } from 'nextjs-koa-api'

export function collectionRouter() {
  return new Router<Koa.DefaultState, ApiContext>()
    .use(checkSession)
    .get('/:collection', validateCollectionPayload, getUserCollection)
    .post('/batch/import', validateImportStations, importStations)
    .delete('/:collection', validateCollectionPayload, deleteCollection)
}
