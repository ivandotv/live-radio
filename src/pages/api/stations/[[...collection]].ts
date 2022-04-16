import { onError, onNoMatch } from 'lib/server/utils'
import {
  checkCollectionExists,
  deleteStation,
  getUserCollection,
  saveStation,
  setupSession,
  validateStation
} from 'lib/server/middleware'
import { setupContext } from 'lib/server/api-context'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

/* Handle CRUD for collections */
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupContext)
  .use(setupSession)
  .get(checkCollectionExists, getUserCollection)
  .post(validateStation, checkCollectionExists, saveStation)
  .delete(checkCollectionExists, deleteStation)

export default handler
