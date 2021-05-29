import { DBSchema, IDBPDatabase, openDB, StoreNames } from 'idb'
import { RadioStation } from 'lib/station-utils'
import { AppStorageService } from './app-storage-service'

interface LocalSchema extends DBSchema {
  favorites: {
    key: string
    value: RadioStation
  }
  history: {
    key: string
    value: RadioStation
  }
}

export class LocalStorage implements AppStorageService {
  protected db!: IDBPDatabase<LocalSchema>

  constructor(public dbName: string) {}

  async getFavoriteStations(): Promise<RadioStation[]> {
    return (await this.getAll('favorites')).reverse()
  }

  async addFavoriteStation(station: RadioStation) {
    return this.put('favorites', station)
  }

  removeFavoriteStation(id: string) {
    return this.delete('favorites', id)
  }

  async getRecentStations(): Promise<RadioStation[]> {
    return (await this.getAll('history')).reverse()
  }

  addRecentStation(station: RadioStation) {
    return this.put('history', station)
  }

  removeRecentStation(id: string) {
    return this.delete('history', id)
  }

  async getLastPlayedStation(): Promise<RadioStation | null> {
    const stations = await this.getAll('history')

    return stations.length ? stations[0] : null
  }

  async initDB() {
    const db = await openDB<LocalSchema>(this.dbName, 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log({ db })
        console.log({ oldVersion })
        console.log({ newVersion })
        console.log({ transaction })
        if (oldVersion === 0) {
          db.createObjectStore('favorites', { keyPath: 'id' })
          db.createObjectStore('history', { keyPath: 'id' })
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

  async get(
    collection: StoreNames<LocalSchema>,
    query: string | IDBKeyRange
  ): Promise<RadioStation | undefined> {
    const db = await this.getDB()

    return await db.get(collection, query)
  }

  async getAll(collection: StoreNames<LocalSchema>) {
    const db = await this.getDB()

    return await db.getAll(collection)
  }

  async set(collection: StoreNames<LocalSchema>, station: RadioStation) {
    const db = await this.getDB()

    return await db.add(collection, station)
  }

  async put(
    collection: StoreNames<LocalSchema>,
    station: RadioStation,
    key?: string | IDBKeyRange | undefined
  ) {
    const db = await this.getDB()

    return await db.put(collection, station, key)
  }

  async delete(collection: StoreNames<LocalSchema>, id: string) {
    const db = await this.getDB()

    return await db.delete(collection, id)
  }
}
