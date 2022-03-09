import { RadioDTO } from 'lib/utils/station-utils'
import { ObjectId } from 'mongodb'
import { isProduction, mongoClient as dbSettings } from 'server-config'
import { AppDao, StationCollection } from './api-utils'
import { connectToDatabase } from './db-connection'

let instance: MongoDao

export function getMongoDao() {
  if (!instance) {
    instance = new MongoDao(connectToDatabase)
  }

  return instance
}

class MongoDao implements AppDao {
  constructor(protected connection: () => Promise<MongoConnection>) {}

  /**
   * Gets user collection
   * @param id - user id
   * @param collection - collection name
   */
  async getUserCollection(id: string, collection: StationCollection) {
    // find the user via session ID (if we are here, session is present)
    const { db } = await this.connection()
    const userStations = await db
      .collection('users')
      .findOne<Record<StationCollection, { _id: string; date: string }[]>>(
        { _id: new ObjectId(id) },
        { projection: { [collection]: 1, _id: 0 } }
      )

    console.log('user stations -> ', userStations)
    if (!userStations || !userStations[collection]) return []

    return this.getStations(userStations[collection].map((data) => data._id))
  }

  /**
   * Gets stations from stations collection
   * @param ids - ids of stations to retrieve
   */
  async getStations(ids: string[]): Promise<RadioDTO[]> {
    // query the stations collection for user stations
    const { db } = await this.connection()

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

    const cursor = db.collection('stations').aggregate<RadioDTO>(query)

    const stations = await cursor.toArray()

    cursor.close()

    return stations
  }

  async importStations(
    userId: string,
    data: { station: RadioDTO; date: string }[],
    collectionName: StationCollection
  ) {
    const { client } = await this.connection()

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        const userStations: { _id: string; date: string }[] = []
        const bulkStations: RadioDTO[] = []

        data.forEach((item) => {
          userStations.push({
            _id: item.station._id,
            date: item.date
          })

          bulkStations.push(item.station)
        })

        await this.bulkCreateStations(bulkStations)

        await this.bulkSaveToUserCollection(
          userId,
          userStations,
          collectionName
        )
      })
    } finally {
      session.endSession()
    }
  }

  /**
   * Saves station to user collection
   * @param userId  - user id
   * @param station  - station data object
   * @param collectionName  - user collection
   */
  async saveToUserCollection(
    userId: string,
    station: RadioDTO,
    collectionName: StationCollection
  ) {
    const { db, client } = await this.connection()

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        const localSession = isProduction ? session : undefined

        const user = await db.collection('users').findOne({
          _id: new ObjectId(userId)
        })

        if (!user) {
          throw new Error('user not found')
        }

        await this.createStation(station)

        //check if recent array exists
        const userCollection = user[collectionName]

        const collection =
          typeof userCollection !== 'undefined' ? [...userCollection] : []

        // find the station
        const found = collection.find((elem) => elem._id === station._id)
        if (found) {
          //just update the date
          found.date = new Date()
        } else {
          // station not in the recent add it
          collection.push({ _id: station._id, date: new Date() })
        }

        //sort by date  - newest first
        collection.sort((a, z) => {
          // @ts-ignore - substracting dates works just fine
          return z.date - a.date
        })

        //limit collection size
        if (collection.length > dbSettings.maxCollectionLimit) {
          collection.splice(0, dbSettings.maxCollectionLimit)
        }

        //save data
        await db.collection('users').updateOne(
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
   * Deletes station from user collection
   * @param userId - user id
   * @param stationId - station id
   * @param collection - user collection
   * @param session - mongoDB client session
   */
  async deleteFromUserCollection(
    userId: string,
    stationId: string,
    collection: StationCollection
  ) {
    const { db } = await this.connection()

    console.log('delete')
    console.log({ userId, stationId, collection })
    const result = await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { [collection]: { _id: stationId } } }
      )

    return Boolean(result.modifiedCount)
  }

  /**
   * Saves station to stations collection
   * @param db - database collection
   * @param station - station payload
   */
  async createStation(station: RadioDTO) {
    const { db } = await this.connection()

    await db
      .collection('stations')
      .updateOne({ _id: station._id }, { $set: station }, { upsert: true })
  }

  protected async bulkCreateStations(stations: RadioDTO[]) {
    const { db } = await this.connection()

    const batch = stations.map((station) => {
      return {
        updateOne: {
          filter: { _id: station._id },
          update: { $set: station },
          upsert: true
        }
      }
    })

    return db.collection('stations').bulkWrite(batch)
  }

  /**
   * Delete user array
   * @param userId  - user id
   * @param station  - station data object
   * @param collection  - user collection
   */
  async deleteUserCollection(
    userId: string,
    collection: StationCollection
  ): Promise<boolean> {
    const { db } = await this.connection()

    //clear data
    const result = await db.collection('users').updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: { [collection]: [] }
      },
      { upsert: true }
    )

    return Boolean(result.modifiedCount)
  }

  protected async bulkSaveToUserCollection(
    userId: string,
    stations: { _id: string; date: string }[],
    collectionName: StationCollection
  ) {
    const { db } = await this.connection()

    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    })

    if (!user) {
      throw new Error('User not found')
    }

    const userCollection = user[collectionName]

    let collection =
      typeof userCollection !== 'undefined'
        ? [...userCollection, ...stations]
        : [...stations]

    const unique = new Map()
    /* filter unique values , and take most recent date for the station */
    for (const station of collection) {
      const present = unique.get(station._id)

      if (present) {
        //take the latest date
        unique.set(station._id, {
          _id: station._id,
          date: present.date > station.date ? present.date : station.date
        })
        continue
      }

      unique.set(station._id, { _id: station._id, date: station.date })
    }

    //sort by date  - newest first
    collection = [...unique.values()].sort((a, z) => {
      // @ts-ignore - substracting dates works just fine
      return z.date - a.date
    })

    //limit collection size
    if (collection.length > 100) {
      collection.splice(0, 100)
    }

    await db.collection('users').updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: { [collectionName]: collection }
      },
      { upsert: true }
    )
  }
}
