import { RadioStation } from 'lib/station-utils'
import { Db, ObjectId } from 'mongodb'
import { StationCollection } from './api-utils'
import { connectToDatabase } from './db-connection'

/**
 * Gets user collection
 * @param id - user id
 * @param collection - collection name
 */
export async function getUserCollection(
  id: string,
  collection: StationCollection
) {
  // find the user via session ID (if we are here, session is present)
  const { db } = await connectToDatabase()
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(id) }, { projection: { [collection]: 1 } })

  return user
}

/**
 * Gets stations from stations collection
 * @param ids - ids of stations to retrieve
 */
export async function getStations(ids: string[]) {
  // query the stations collection for user stations
  const { db } = await connectToDatabase()

  let query = [
    { $match: { _id: { $in: ids } } },
    {
      $addFields: {
        __order: { $indexOfArray: [ids, '$_id'] }
      }
    },
    { $sort: { __order: 1 } },
    { $project: { __order: 0 } }
  ]

  const cursor = db.collection('stations').aggregate(query)

  const stations = await cursor.toArray()

  await cursor.close() //no need to wait

  return stations
}

/**
 * Saves station to user collection
 * @param userId  - user id
 * @param station  - station data object
 * @param collection  - user collection
 */
export async function saveToUserCollection(
  userId: string,
  station: RadioStation,
  collection: StationCollection
) {
  const { db, client } = await connectToDatabase()

  const session = client.startSession()
  try {
    await session.withTransaction(async () => {
      if (collection === 'recent') {
        await saveToRecentCollection(db, station, userId)
      } else {
        await saveToFavoriteCollection(db, station, userId)
      }
    })
  } catch (e) {
    throw e
    //TODO -log
  } finally {
    session.endSession()
  }
}

/**
 * Saves station to stations collection
 * @param db - database collection
 * @param station - station payload
 */
async function saveStation(db: Db, station: RadioStation) {
  return await db
    .collection('stations')
    .updateOne({ _id: station._id }, { $set: station }, { upsert: true })
}

/**
 * Saves station to user recent collection
 * @param db - database connection
 * @param station - station payload
 * @param userId  - user id
 */
async function saveToRecentCollection(
  db: Db,
  station: RadioStation,
  userId: string
) {
  await saveStation(db, station)

  return await db.collection('users').update(
    {
      _id: new ObjectId(userId)
    },
    {
      $addToSet: { recent: { id: station._id, date: new Date() } },
      $set: { lastPlayed: station._id }
    }
  )
}

/**
 * Saves station to user favorite collection
 * @param db - database connection
 * @param station - station payload
 * @param userId - user id
 */
async function saveToFavoriteCollection(
  db: Db,
  station: RadioStation,
  userId: string
) {
  await saveStation(db, station) //todo -move outside

  await db.collection('users').update(
    {
      _id: new ObjectId(userId)
    },
    {
      $addToSet: { favorites: { id: station._id, date: new Date() } }
    }
  )
}

/**
 * Deletes station from user collection
 * @param userId - user id
 * @param stationId - station id
 * @param collection - user collection
 */
export async function deleteStationFromCollection(
  userId: string,
  stationId: string,
  collection: StationCollection
) {
  const { db } = await connectToDatabase()

  return await db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { [collection]: { id: stationId } } }
    )
}

/**
 * Gets last played station by user
 * @param userId  - user id
 */
export async function getLastPlayedStation(userId: string) {
  const { db } = await connectToDatabase()

  return await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { lastPlayed: 1 } })
}
