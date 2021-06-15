import { isProduction } from 'app-config'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  deleteStationFromCollection,
  getLastPlayedStation,
  getStations,
  getUserCollection,
  saveToUserCollection
} from './db-calls'
import { connectToDatabase } from './db-connection'
import { NextApiRequestWithSession } from './middleware'

export type StationCollection = 'favorites' | 'recent'

type UserStationData = { date: string; id: string }

/**
 * Handle uncaught api errors
 */
export function onError(err: any, req: NextApiRequest, res: NextApiResponse) {
  console.log(err)
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

/**
 * Gets stations for a particular collection
 * @param collection - user collection
 */
export function getUserStations(collection: StationCollection) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    // find the user via session ID (if we are here, session is present)
    const user = await getUserCollection(req.session!.user.id, collection)
    if (!user) {
      return res.status(401).json({ msg: 'Not authorized' })
    }

    let stations = []

    if (user[collection]) {
      // sort the collection by date added
      const sorted = user[collection]
        .sort(
          (a: UserStationData, b: UserStationData) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .map(function (obj: UserStationData) {
          return obj.id
        })

      stations = await getStations(sorted)
    }

    return res.json(stations)
  }
}

/**
 * Handle saving stations to particular collections
 * @param collection - where to save the station
 */
export function handleSaveStation(collection: StationCollection) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    await saveToUserCollection(req.session!.user.id, req.body, collection)

    return res.status(201).json({ msg: 'Saved' })
  }
}

/**
 * Deletes station from a particular collection
 * @param collection - name of the collection
 */
export function deleteStation(collection: StationCollection) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const id = req.query.id as string

    if (!id) {
      return res.status(400).json({ msg: 'Station ID expected' })
    }

    const result = await deleteStationFromCollection(
      req.session!.user.id,
      id,
      collection
    )
    if (result.modifiedCount) {
      return res.status(200).json({ msg: 'deleted' })
    }

    return res.status(404).json({ msg: 'not found' })
  }
}

/**
 * Gets last played station for user
 * @param collection - user collection
 */
export async function getLastPlayed(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase()

  let lastPlayed = null
  const user = await getLastPlayedStation(req.session!.user.id)
  if (!user) {
    return res.status(401).json({ msg: 'Not authorized' })
  }

  if (user.lastPlayed) {
    lastPlayed = await db
      .collection('stations')
      .findOne({ _id: user.lastPlayed })
  }

  return res.json([lastPlayed])
}
