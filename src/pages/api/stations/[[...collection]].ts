import { onError, onNoMatch } from 'lib/api/api-utils'
import {
  checkCollectionExists,
  deleteStation,
  getUserCollection,
  saveStation,
  setupSession,
  validateStation
} from 'lib/api/middleware'
import { setupLogger } from 'lib/logger-server'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

/* Handle CRUD for collections */
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupLogger)
  .use(setupSession)
  .get(checkCollectionExists, getUserCollection)
  .post(validateStation, checkCollectionExists, saveStation)
  .delete(checkCollectionExists, deleteStation)

export default handler
