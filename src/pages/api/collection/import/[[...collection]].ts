import { onError, onNoMatch } from 'lib/server/utils'
import {
  bulkValidateStations,
  checkCollectionExists,
  importStations,
  setupSession
} from 'lib/server/middleware'
import { setupContext } from 'lib/server/api-context'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

// Handle bulk import stations
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupContext, setupSession)
  .post(checkCollectionExists, bulkValidateStations, importStations)

export default handler
