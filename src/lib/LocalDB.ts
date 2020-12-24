import { IDBPDatabase, openDB } from 'idb'
import { RadioStation } from 'types'

// force singleton for AppDB
export interface AppStorage {
  addStationTofavorites: (station: RadioStation) => void
  removeStationFromfavorites: (id: string) => void
  getfavoriteStations: () => Promise<RadioStation[]>
}
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
  protected db: IDBPDatabase | undefined

  constructor() {}

  async initDB() {
    const db = await openDB('LiveRadio', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log({ db })
        console.log({ oldVersion })
        console.log({ newVersion })
        console.log({ transaction })
        if (oldVersion === 0) {
          db.createObjectStore('favorites', { keyPath: 'id' })
          db.createObjectStore('recent', { keyPath: 'id' })
          db.createObjectStore('lastStation', { keyPath: 'id' })
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

  async addStationTofavorites(station: RadioStation) {
    const db = await this.getDB()

    return await db.add('favorites', station)
  }

  async removeStationFromfavorites(id: string) {
    const db = await this.getDB()

    return await db.delete('favorites', id)
  }

  async getfavoriteStations(): Promise<RadioStation[]> {
    const db = await this.getDB()

    return await db.getAll('favorites')
  }
}
