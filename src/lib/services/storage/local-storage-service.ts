import { DBSchema, IDBPDatabase, openDB, StoreNames } from 'idb'
import { StationCollection } from 'lib/api/api-utils'
import { RadioDTO } from 'lib/utils/station-utils'

type DBValue = { station: RadioDTO; date: string; _id: string }

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

export class LocalStorageService {
  protected db!: IDBPDatabase<LocalSchema>

  constructor(public dbName: string) {}

  async getStations(collection: StationCollection): Promise<RadioDTO[]> {
    const data = await this.getAll(collection)

    return this.sortData(data)
  }

  async getRawData(
    collection: StationCollection
  ): Promise<{ station: RadioDTO; date: string }[]> {
    const data = await this.getAll(collection)

    return data.map((data) => ({
      station: data.station,
      date: data.date
    }))
  }

  async removeAllStations(collection: StoreNames<LocalSchema>) {
    const db = await this.getDB()

    await db.clear(collection)

    return true
  }

  async addStation(station: RadioDTO, collection: StationCollection) {
    await this.put(collection, {
      station,
      date: new Date().toISOString(),
      _id: station._id
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
        console.log({ oldVersion })
        console.log({ newVersion })
        if (newVersion === 1) {
          db.createObjectStore('favorites', { keyPath: '_id' })
          db.createObjectStore('recent', { keyPath: '_id' })
        }
      },
      blocked() {
        console.log('idb blocked')
      },
      blocking() {
        console.log('idb blocking')
      },
      terminated() {
        console.log('idb terminated')
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
          station: data.station,
          date: new Date(data.date)
        }))
        // @ts-expect-error - substracting dates is fine
        .sort((a: DBValue, z: DBValue) => z.date - a.date)
        .map((data: { station: RadioDTO; date: Date }) => data.station)
    )
  }
}
