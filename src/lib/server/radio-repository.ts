import { isProduction, mongoDb } from 'lib/server/config'
import { RadioDTO } from 'lib/shared/utils'
import { Db, ObjectId } from 'mongodb'
import { IRadioRepository, StationCollection } from './utils'

export class RadioRepository implements IRadioRepository {
  protected db: Db

  constructor(protected client: MongoClient, dbName?: string) {
    this.db = this.client.db(dbName || mongoDb.dbName)
  }

  /**
   * Gets user collection
   * @param id - user id
   * @param collection - collection name
   */
  async getUserCollection(id: string, collection: StationCollection) {
    const userStations = await this.db
      .collection('users')
      .findOne<Record<StationCollection, { _id: string; date: string }[]>>(
        { _id: new ObjectId(id) },
        { projection: { [collection]: 1, _id: 0 } }
      )

    if (!userStations || !userStations[collection]) return []

    return userStations[collection].map((data) => data._id)
  }

  async import(
    userId: string,
    data: { station: RadioDTO; date: string }[],
    collectionName: StationCollection
  ) {
    const session = this.client.startSession()
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

        // await this.bulkCreateStations(bulkStations)

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
  async save(
    userId: string,
    station: RadioDTO,
    collectionName: StationCollection
  ) {
    const session = this.client.startSession()
    try {
      await session.withTransaction(async () => {
        const localSession = isProduction ? session : undefined

        const user = await this.db.collection('users').findOne({
          _id: new ObjectId(userId)
        })

        if (!user) {
          throw new Error('user not found')
        }

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
          // @ts-espect-error - substracting dates works just fine
          return z.date - a.date
        })

        //limit collection size
        if (collection.length > mongoDb.maxRadioCollectionLimit) {
          collection.splice(0, mongoDb.maxRadioCollectionLimit)
        }

        await this.db.collection('users').updateOne(
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
  async delete(
    userId: string,
    stationId: string,
    collection: StationCollection
  ) {
    const result = await this.db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { [collection]: { _id: stationId } } }
      )

    return Boolean(result.modifiedCount)
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
    //clear data
    const result = await this.db.collection('users').updateOne(
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
    const user = await this.db.collection('users').findOne({
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
      return z.date - a.date
    })

    //limit collection size
    if (collection.length > 100) {
      collection.splice(0, 100)
    }

    await this.db.collection('users').updateOne(
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