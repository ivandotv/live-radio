import * as Sentry from '@sentry/nextjs'
// import { logger } from 'lib/logger-browser'
import { logger } from 'lib/logger-server'
import { RadioDTO } from 'lib/utils/station-utils'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { isProduction } from 'server-config'

export type StationCollection = 'favorites' | 'recent'

export interface AppDao {
  getStations(ids: string[]): Promise<RadioDTO[]>
  getUserCollection(
    id: string,
    collection: StationCollection
  ): Promise<RadioDTO[]>
  saveToUserCollection(
    userId: string,
    station: RadioDTO,
    collectionName: StationCollection
  ): Promise<void>
  deleteFromUserCollection(
    userId: string,
    stationId: string,
    collectionName: StationCollection
  ): Promise<boolean>
  createStation(station: RadioDTO): Promise<void>
  importStations(
    userId: string,
    data: { station: RadioDTO; date: string }[],
    collectionName: StationCollection
  ): Promise<void>
  deleteUserCollection(
    userId: string,
    collection: StationCollection
  ): Promise<boolean>
}
/**
 * Handle uncaught api errors
 */
export function onError(err: any, _req: NextApiRequest, res: NextApiResponse) {
  if (isProduction) {
    Sentry.captureException(err)
  }
  // console.log('CONN ', err)
  logger.info('ERRROR ---')
  // console.log('context store ', context.getStore())
  // context.getStore().info('from  store')
  res.status(500).json({
    msg: 'Internal Server Error',
    debug: isProduction ? undefined : err.toString()
  })
}

/**
 * Handle 404 api requests
 */
export function onNoMatch(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({
    msg: 'Resource not found',
    debug: isProduction
      ? undefined
      : {
          url: req.url,
          query: req.query,
          method: req.method,
          headers: req.headers
        }
  })
}

export function withErrorLogging(handler: NextApiHandler) {
  if (isProduction) {
    return Sentry.withSentry(handler)
  }

  return (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res)
  }
}
