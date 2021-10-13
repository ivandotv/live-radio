import { DBSchema, IDBPDatabase, openDB, StoreNames } from 'idb'
import { RadioDTO } from 'lib/station-utils'
import { AppStorageService } from './app-storage-service'

type DBValue = { station: RadioDTO; date: Date; _id: string }

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

export class LocalStorage implements AppStorageService {
  protected db!: IDBPDatabase<LocalSchema>

  constructor(public dbName: string) {}

  protected sortData(data: DBValue[]) {
    return (
      data
        // @ts-expect-error - substracting dates is fine
        .sort((a: DBValue, b: DBValue) => b.date - a.date)
        .map((data: DBValue) => data.station)
    )
  }

  async getFavoriteStations(): Promise<RadioDTO[]> {
    const data = await this.getAll('favorites')

    return this.sortData(data)
  }

  async addFavoriteStation(station: RadioDTO) {
    return this.put('favorites', {
      station,
      date: new Date(),
      _id: station._id
    })
  }

  removeFavoriteStation(id: string) {
    return this.delete('favorites', id)
  }

  async getRecentStations(): Promise<RadioDTO[]> {
    const data = await this.getAll('recent')

    return this.sortData(data)
  }

  addRecentStation(station: RadioDTO) {
    return this.put('recent', { station, date: new Date(), _id: station._id })
  }

  removeRecentStation(id: string) {
    return this.delete('recent', id)
  }

  async initDB() {
    const db = await openDB<LocalSchema>(this.dbName, 1, {
      upgrade(db, oldVersion, _newVersion, _transaction) {
        if (oldVersion === 0) {
          db.createObjectStore('favorites', { keyPath: '_id' })
          db.createObjectStore('recent', { keyPath: '_id' })
        }
      },
      blocked() {
        console.log('blocked')
      },
      blocking() {
        console.log('blocking')
      },
      terminated() {
        console.log('terminated')
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

  // async get(
  //   collection: StoreNames<LocalSchema>,
  //   query: string | IDBKeyRange
  // ): Promise<RadioStation | undefined> {
  //   const db = await this.getDB()

  //   cons await db.get(collection, query)
  // }

  async getAll(collection: StoreNames<LocalSchema>) {
    const db = await this.getDB()

    return await db.getAll(collection)
  }

  // async set(collection: StoreNames<LocalSchema>, station: RadioStation) {
  //   const db = await this.getDB()

  //   return await db.add(collection, station)
  // }

  async put(collection: StoreNames<LocalSchema>, data: DBValue) {
    const db = await this.getDB()

    return await db.put(collection, data)
  }

  async delete(collection: StoreNames<LocalSchema>, id: string) {
    const db = await this.getDB()

    return await db.delete(collection, id)
  }
}
