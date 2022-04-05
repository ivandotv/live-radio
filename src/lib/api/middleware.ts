import { logger } from 'lib/logger-server'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { NextHandler } from 'next-connect'
import { isProduction } from 'server-config'
import { StationCollection } from './api-utils'
import { getMongoDao } from './dao'
import { importSchema, stationSchema } from './schemas'

export type NextApiRequestWithSession = NextApiRequest & {
  session?: Session
}

/**
 * Check if user is authenticated
 */
export async function setupSession(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req })
  logger.info('session')
  if (!session) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }
  req.session = session
  next()
}

/**
 * Validate station payload
 */
export function validateStation(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { error } = stationSchema.validate(req.body.station, {
    errors: { render: false }
  })

  if (error) {
    return res.status(422).json({
      msg: 'Not a valid Station object',
      debug: isProduction ? undefined : error
    })
  }

  next()
}

/**
 * Validate array of stations payload
 */
export function bulkValidateStations(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { error } = importSchema.validate(req.body.stations, {
    errors: { render: false }
  })

  if (error) {
    return res.status(422).json({
      msg: 'Not all stations are valid',
      debug: isProduction ? undefined : error
    })
  }

  next()
}

/**
 * Gets stations for a particular collection
 */

//TODO - get user STATIONS DAO
export function checkCollectionExists(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) {
  const collection: StationCollection | undefined = req.query.collection
    ? (req.query.collection[0] as StationCollection)
    : undefined

  if (!collection) {
    return res.status(400).json({ msg: 'collection missing' })
  }

  if (-1 === ['favorites', 'recent'].indexOf(collection)) {
    return res.status(404).json({ msg: 'collection not found' })
  }
  logger.info('check collection exist')
  next()
}

/**
 * Get user collection
 */
export async function getUserCollection(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  const stations = await getMongoDao().getUserCollection(
    req.session!.user.id,
    collection
  )

  return res.json(stations)
}

/**
 * Handle saving stations to particular collections
 */
export async function saveStation(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  await getMongoDao().saveToUserCollection(
    req.session!.user.id,
    req.body.station,
    collection
  )

  return res.status(201).json({ msg: 'saved' })
}

/**
 * Deletes station from a particular collection
 */
export async function deleteStation(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({ msg: 'Station ID expected' })
  }

  const result = await getMongoDao().deleteFromUserCollection(
    req.session!.user.id,
    id,
    collection
  )
  if (result) {
    return res.status(200).json({ msg: 'deleted' })
  }

  return res.status(404).json({ msg: 'not found' })
}

/**
 * Deletes the whole collection
 */
export async function deleteCollection(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  const result = await getMongoDao().deleteUserCollection(
    req.session!.user.id,
    collection
  )
  if (result) {
    return res.status(200).json({ msg: 'deleted' })
  }

  return res.status(404).json({ msg: 'not found' })
}

/**
 * Validate array of stations payload
 */
export async function importStations(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  await getMongoDao().importStations(
    req.session!.user.id,
    req.body.stations,
    collection
  )

  return res.status(201).json({ msg: 'saved' })
}
