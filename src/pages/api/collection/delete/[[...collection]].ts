import { onError, onNoMatch } from 'lib/api/api-utils'
import {
  checkCollectionExists,
  deleteCollection,
  setupSession
} from 'lib/api/middleware'
import { setupLogger } from 'lib/logger-server'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupLogger, setupSession)
  .delete(checkCollectionExists, deleteCollection)

export default handler
