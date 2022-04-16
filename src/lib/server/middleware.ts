import { logger } from 'lib/server/api-context'
import { RadioRepository } from 'lib/server/radio-repository'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { NextHandler } from 'next-connect'
import { isProduction } from 'lib/server/config'
import { StationCollection } from 'lib/server/utils'
import { importSchema, stationSchema } from 'lib/server/schemas'
import { RadioBrowserApi } from 'radio-browser-api'
import { dataToRadioDTO } from 'lib/shared/utils'

export type AppRequest = NextApiRequest & {
  session?: Session
  ctx: {
    radioRepository: RadioRepository
    radioApi: RadioBrowserApi
  }
}

/**
 * Check if user is authenticated
 */
export async function setupSession(
  req: AppRequest,
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
  req: AppRequest,
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
export async function getUserCollection(req: AppRequest, res: NextApiResponse) {
  const { radioApi, radioRepository } = req.ctx

  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  const stationIds = await radioRepository.getUserCollection(
    req.session!.user.id,
    collection
  )

  const stations = await radioApi.getStationsById(stationIds)

  return res.json(dataToRadioDTO(stations))
}

/**
 * Handle saving stations to particular collections
 */
export async function saveStation(req: AppRequest, res: NextApiResponse) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  await req.ctx.radioRepository.save(
    req.session!.user.id,
    req.body.station,
    collection
  )

  return res.status(201).json({ msg: 'saved' })
}

/**
 * Deletes station from a particular collection
 */
export async function deleteStation(req: AppRequest, res: NextApiResponse) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({ msg: 'Station ID expected' })
  }

  const result = await req.ctx.radioRepository.delete(
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
export async function deleteCollection(req: AppRequest, res: NextApiResponse) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  const result = await req.ctx.radioRepository.deleteUserCollection(
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
export async function importStations(req: AppRequest, res: NextApiResponse) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  await req.ctx.radioRepository.import(
    req.session!.user.id,
    req.body.stations,
    collection
  )

  return res.status(201).json({ msg: 'saved' })
}
