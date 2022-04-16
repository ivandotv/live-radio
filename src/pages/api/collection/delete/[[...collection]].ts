import { onError, onNoMatch } from 'lib/server/utils'
import {
  checkCollectionExists,
  deleteCollection,
  setupSession
} from 'lib/server/middleware'
import { setupContext } from 'lib/server/api-context'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupContext, setupSession)
  .delete(checkCollectionExists, deleteCollection)

export default handler
