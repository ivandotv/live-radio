import { Db, ObjectId } from 'mongodb'
import { transform } from 'pumpit'
import { ServerConfig } from './config'
import { connectionFactory } from './db-connection'

export interface IRadioRepository {
  getCollection(id: string, collection: string): Promise<string[]>
  deleteCollection(userId: string, collection: string): Promise<boolean>
  saveStation(
    userId: string,
    stationId: string,
    collectionName: string
  ): Promise<void>
  deleteStation(
    userId: string,
    stationId: string,
    collectionName: string
  ): Promise<boolean>
  importCollection(
    userId: string,
    data: { _id: string; date: Date }[],
    collectionName: string
  ): Promise<void>
}

export class RadioRepository implements IRadioRepository {
  protected db?: Db

  static inject = transform(
    [connectionFactory, 'config'],
    (_, conn: any, config: ServerConfig) => {
      const dbConfig = {
        dbName: config.mongoDb.dbName,
        maxCollectionLimit: config.mongoDb.maxRadioCollectionLimit
      }

      return [conn, dbConfig]
    }
  )

  constructor(
    protected client: ReturnType<typeof connectionFactory>,
    // protected dbName: string,
    protected opts: {
      dbName: string
      maxCollectionLimit: number
    }
  ) {}

  protected async connect() {
    if (!this.db) {
      const conn = await this.client()
      this.db = conn.db(this.opts.dbName)
    }

    return this.db
  }

  /**
   * Gets user collection
   * @param id - user id
   * @param collection - collection name
   */
  async getCollection(id: string, collection: string) {
    const db = await this.connect()
    const userStations = await db
      .collection('users')
      .findOne<Record<string, { _id: string; date: string }[]>>(
        { _id: new ObjectId(id) },
        { projection: { [collection]: 1, _id: 0 } }
      )

    if (!userStations || !userStations[collection]) return []

    return userStations[collection].map((data) => data._id)
  }

  /**
   * Saves station to user collection
   * @param userId  - user id
   * @param stationId  - station data object
   * @param collectionName  - user collection
   */
  async saveStation(
    userId: string,
    // stationId: RadioDTO,
    stationId: string,
    collectionName: string
  ) {
    const db = await this.connect()
    const user = await db.collection('users').findOne({
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
    const found = collection.find((elem) => elem._id === stationId)
    if (found) {
      //just update the date
      found.date = new Date()
    } else {
      // station not in the recent add it
      collection.push({ _id: stationId, date: new Date() })
    }

    //sort by date  - newest first
    collection.sort((a, z) => {
      // @ts-espect-error - substracting dates works just fine
      return z.date - a.date
    })

    //limit collection size
    if (collection.length > this.opts.maxCollectionLimit) {
      collection.splice(this.opts.maxCollectionLimit)
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

  /**
   * Deletes station from user collection
   * @param userId - user id
   * @param stationId - station id
   * @param collection - user collection
   */
  async deleteStation(userId: string, stationId: string, collection: string) {
    const db = await this.connect()
    const result = await db
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
  async deleteCollection(userId: string, collection: string): Promise<boolean> {
    //clear data
    const db = await this.connect()

    const result = await db.collection('users').updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $unset: { [collection]: '' }
      },
      { upsert: true }
    )

    return Boolean(result.modifiedCount)
  }

  async importCollection(
    userId: string,
    stations: { _id: string; date: Date }[],
    collectionName: string
  ) {
    const db = await this.connect()
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
        //update: take the newest date
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
    if (collection.length > this.opts.maxCollectionLimit) {
      collection.splice(this.opts.maxCollectionLimit)
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
