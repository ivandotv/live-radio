import { onError, onNoMatch } from 'lib/api/api-utils'
import {
  bulkValidateStations,
  checkCollectionExists,
  importStations,
  setupSession
} from 'lib/api/middleware'
import { setupLogger } from 'lib/logger-server'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

// Handle bulk import stations
const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(setupLogger, setupSession)
  .post(checkCollectionExists, bulkValidateStations, importStations)

export default handler
