import {
  ApiContext,
  ApiState,
  checkSession
} from 'lib/server/api/shared-middleware'
import {
  bulkStationInfo,
  countStationClick,
  customSearch,
  deleteStation,
  saveStation,
  songInfo,
  stationInfo,
  validateStationFromBody,
  validateStationFromQuery,
  voteForStation
} from 'lib/server/api/station/middleware'
import { Router } from 'nextjs-koa-api'

export function stationRouter() {
  return new Router<ApiState, ApiContext>()
    .get('/', stationInfo)
    .post('/', checkSession, validateStationFromBody, saveStation)
    .delete('/', checkSession, validateStationFromQuery, deleteStation)
    .get('/song-info', songInfo)
    .post('/bulk-info', bulkStationInfo)
    .post('/search', customSearch)
    .post('/click', countStationClick)
    .post('/vote', voteForStation)
}
