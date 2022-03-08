import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { NextHandler } from 'next-connect'
import { isProduction } from 'server-config'
import { StationCollection } from './api-utils'
import { getMongoDao } from './dao'

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
  if (!session) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }
  req.session = session
  next()
}

// schema for validating the station payload
const stationSchema = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  homepage: Joi.string().required().allow(''),
  tags: Joi.array().required().items(Joi.string().allow('')),
  language: Joi.array().required().items(Joi.string().allow('')),
  codec: Joi.string().required(),
  flag: Joi.string().required().allow(''),
  continent: Joi.string().required().allow(''),
  continentCode: Joi.string().required().allow(''),
  country: Joi.string().required().allow(''),
  countryCode: Joi.string().required().allow('')
})

const importSchema = Joi.array().items(
  Joi.object().keys({
    station: stationSchema,
    date: Joi.date().required()
  })
)

/**
 * Validates station payload
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function validateStation(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  console.log('validate ', req.body.station)
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
 * Validates array of stations payload
 * @param req
 * @param res
 * @param next
 * @returns
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
 * @param collection - user collection
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

  console.log({ query: req.query })

  if (!collection) {
    return res.status(400).json({ msg: 'collection missing' })
  }

  if (-1 === ['favorites', 'recent'].indexOf(collection)) {
    return res.status(404).json({ msg: 'collection not found' })
  }
  next()
}

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
 * @param collection - where to save the station
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
 * @param collection - name of the collection
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
 * @param collection - name of the collection
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
 * Validates array of stations payload
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function importStations(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const collection: StationCollection = req.query
    .collection[0] as StationCollection

  console.log('import stations ', req.body.stations)

  await getMongoDao().importStations(
    req.session!.user.id,
    req.body.stations,
    collection
  )

  return res.status(201).json({ msg: 'saved' })
}
