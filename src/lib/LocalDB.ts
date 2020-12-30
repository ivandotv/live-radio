import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { RadioStation } from 'types'

export interface AppStorage {
  addStationToFavorites: (station: RadioStation) => Promise<string>
  removeStationFromFavorites: (id: string) => Promise<void>
  getFavoriteStations: () => Promise<RadioStation[]>
  getLastPlayedStation: () => Promise<RadioStation | undefined>
  setLastPlayedStation: (station: RadioStation) => Promise<number>
}

interface AppDB extends DBSchema {
  favorites: {
    key: string
    value: RadioStation
  }
  recent: {
    value: RadioStation
    key: string
  }
  lastStation: {
    key: number
    value: RadioStation
  }
}

// force singleton for AppDB
let instance: LocalDB

export function getLocalDB() {
  const isSSR = typeof window === 'undefined'

  if (isSSR || !instance) {
    instance = new LocalDB()
  }

  return instance
}
// export type IAppDB = InstanceType<typeof AppDB>

export class LocalDB implements AppStorage {
  protected db!: IDBPDatabase<AppDB>

  constructor() {}

  async initDB() {
    const db = await openDB<AppDB>('LiveRadio', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log({ db })
        console.log({ oldVersion })
        console.log({ newVersion })
        console.log({ transaction })
        if (oldVersion === 0) {
          db.createObjectStore('favorites', { keyPath: 'id' })
          db.createObjectStore('recent', { keyPath: 'id' })
          db.createObjectStore('lastStation')
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
      return await this.initDB()
    }

    return this.db
  }

  async getLastPlayedStation() {
    const db = await this.getDB()

    return await db.get('lastStation', 1)
  }

  async setLastPlayedStation(station: RadioStation) {
    const db = await this.getDB()

    return await db.put('lastStation', station, 1)
  }

  async addStationToFavorites(station: RadioStation) {
    const db = await this.getDB()

    return await db.add('favorites', station)
  }

  async removeStationFromFavorites(id: string) {
    const db = await this.getDB()

    return await db.delete('favorites', id)
  }

  async getFavoriteStations(): Promise<RadioStation[]> {
    const db = await this.getDB()

    return await db.getAll('favorites')
  }
}
