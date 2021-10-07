import { db as dbSettings, isProduction } from 'server-config'
import { RadioDTO } from 'lib/station-utils'
import { ClientSession, Db, ObjectId } from 'mongodb'
import { StationCollection } from './api-utils'
import { connectToDatabase } from './db-connection'

type MongoUser = {
  _id: ObjectId
  recent?: { id: string; date: Date }[]
  favorites?: { id: string; date: Date }[]
  lastPlayed?: string
}
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

  const query = [
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
 * @param collectionName  - user collection
 */
export async function saveToUserCollection(
  userId: string,
  station: RadioDTO,
  collectionName: StationCollection
) {
  const { db, client } = await connectToDatabase()

  const session = client.startSession()
  try {
    await session.withTransaction(async () => {
      const localSession = isProduction ? session : undefined
      await saveStation(db, station, localSession)

      const user: MongoUser | null = await db.collection('users').findOne({
        _id: new ObjectId(userId)
      })

      let collection
      if (user) {
        //check if recent array exists
        const userCollection = user[collectionName]

        collection =
          typeof userCollection !== 'undefined'
            ? (collection = [...userCollection])
            : []

        // find the station
        const found = collection.find((elem) => elem.id === station._id)
        if (found) {
          //just update the date
          found.date = new Date()
        } else {
          // station not in the recent add it
          collection.push({ id: station._id, date: new Date() })
        }

        //sort by date  - newest first
        collection.sort((a, b) => {
          // @ts-ignore - substracting dates works just fine
          return b.date - a.date
        })

        //limit to last 100
        if (collection.length > dbSettings.maxCollectionLimit) {
          collection.splice(0, dbSettings.maxCollectionLimit)
        }
      } else {
        throw new Error('user not found')
      }

      //save the data back
      db.collection('users').updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $set: { [collectionName]: collection }
        },
        { session: localSession, upsert: true }
      )
    })
  } finally {
    session.endSession()
  }
}

/**
 * Saves station to stations collection
 * @param db - database collection
 * @param station - station payload
 * @param session - mongodb client session
 */
async function saveStation(db: Db, station: RadioDTO, session?: ClientSession) {
  return await db
    .collection('stations')
    .updateOne(
      { _id: station._id },
      { $set: station },
      { upsert: true, session }
    )
}

/**
 * Deletes station from user collection
 * @param userId - user id
 * @param stationId - station id
 * @param collection - user collection
 * @param session - mongoDB client session
 */
export async function deleteStationFromCollection(
  userId: string,
  stationId: string,
  collection: StationCollection,
  session?: ClientSession
) {
  const { db } = await connectToDatabase()

  return await db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { [collection]: { id: stationId } } },
      { session }
    )
}
