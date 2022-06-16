import { DBSchema, IDBPDatabase, openDB, StoreNames } from 'idb'
import { logger } from 'lib/client/logger-browser'
import { StationCollection } from 'lib/server/utils'
import { SharedConfig } from 'lib/shared/config'
import { transform } from 'pumpit'

type DBValue = { date: string; _id: string }

const storageLogger = logger.child({ label: 'local-storage' })

interface LocalSchema extends DBSchema {
  favorites: {
    key: string
    value: DBValue
  }
  recent: {
    key: string
    value: DBValue
  }
}

//TODO - use transactions
export class LocalStorageService {
  protected db!: IDBPDatabase<LocalSchema>

  static inject = transform(['sharedConfig'], (_, config: SharedConfig) => {
    return [config.localDbName]
  })

  constructor(public dbName: string) {}

  async getStations(collection: StationCollection) {
    const data = await this.getAll(collection)

    return this.sortData(data)
  }

  async getRawData(
    collection: StationCollection
  ): Promise<{ station: string; date: string }[]> {
    const data = await this.getAll(collection)

    return data.map((data) => ({
      station: data._id,
      date: data.date
    }))
  }

  async removeAllStations(collection: StoreNames<LocalSchema>) {
    const db = await this.getDB()

    await db.clear(collection)

    return true
  }

  async addStation(station: string, collection: StationCollection) {
    await this.put(collection, {
      // station,
      date: new Date().toISOString(),
      _id: station
    })

    return true
  }

  async removeStation(id: string, collection: StationCollection) {
    await this.delete(collection, id)

    return true
  }

  async initDB() {
    const db = await openDB<LocalSchema>(this.dbName, 1, {
      upgrade(db, oldVersion, newVersion, _transaction) {
        if (newVersion === 1) {
          db.createObjectStore('favorites', { keyPath: '_id' })
          db.createObjectStore('recent', { keyPath: '_id' })
        }
      },
      blocked() {
        storageLogger.warn('idb blocked')
      },
      blocking() {
        storageLogger.warn('idb blocking')
      },
      terminated() {
        storageLogger.warn('idb terminated')
      }
    })

    return db
  }

  async getDB() {
    if (!this.db) {
      this.db = await this.initDB()
    }

    return this.db
  }

  protected async getAll(collection: StoreNames<LocalSchema>) {
    const db = await this.getDB()

    return db.getAll(collection)
  }

  protected async put(collection: StoreNames<LocalSchema>, data: DBValue) {
    const db = await this.getDB()

    return await db.put(collection, data)
  }

  protected async delete(collection: StoreNames<LocalSchema>, id: string) {
    const db = await this.getDB()

    return await db.delete(collection, id)
  }

  protected sortData(data: DBValue[]) {
    return (
      data
        .map((data: DBValue) => ({
          station: data._id,
          date: new Date(data.date)
        }))
        // @ts-expect-error - subtracting dates is fine
        .sort((a: DBValue, z: DBValue) => z.date - a.date)
        .map((data: { station: string; date: Date }) => data.station)
    )
  }
}
