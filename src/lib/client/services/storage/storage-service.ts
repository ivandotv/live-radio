import { AuthService } from 'lib/client/services/auth-service'
import { client, FetchClient } from 'lib/shared/fetch-client'
import { RadioDTO } from 'lib/shared/utils'
import { Session } from 'next-auth'
import { LocalStorageService } from './local-storage-service'
import { RemoteStorageService } from './remote-storage-service'

export type StorageType = 'local' | 'remote'
export type StorageCollectionName = 'favorites' | 'recent'

export class StorageService {
  protected session: Session | null = null

  protected resolved = false

  constructor(
    protected local: LocalStorageService,
    protected remote: RemoteStorageService,
    protected authService: AuthService,
    protected httpClient: FetchClient
  ) {}

  static inject = [
    LocalStorageService,
    RemoteStorageService,
    AuthService,
    client
  ]

  protected async resolveStorage(type?: StorageType) {
    //short circuit session check
    if ('local' === type) return { storage: this.local, type: 'local' }
    if ('remote' === type) return { storage: this.remote, type: 'remote' }

    const session = await this.authService.getAuth()
    if (session) {
      return { storage: this.remote, type: 'remote' }
    }

    return { storage: this.local, type: 'local' }
  }

  async transferAnonymousData(
    favorites: boolean,
    recent: boolean,
    deleteAll: boolean
  ) {
    const [localFavs, localRecent] = await Promise.all([
      favorites ? this.local.getRawData('favorites') : [],
      recent ? this.local.getRawData('recent') : []
    ])

    // const [favResult, recentResult] = await Promise.all([
    //   localFavs.length
    //     ? this.remote.importStations(localFavs, 'favorites')
    //     : [],
    //   localRecent.length
    //     ? this.remote.importStations(localRecent, 'recent')
    //     : []
    // ])

    const result = await this.remote.importStations({
      favorites: localFavs,
      recent: localRecent
    })

    if (deleteAll) {
      Promise.all([
        this.local.removeAllStations('favorites'),
        this.local.removeAllStations('recent')
      ])
    }

    return result
  }

  async saveStation(station: string, collection: StorageCollectionName) {
    const { storage } = await this.resolveStorage()

    return storage.addStation(station, collection)
  }

  async removeStation(id: string, collection: StorageCollectionName) {
    const { storage } = await this.resolveStorage()

    return storage.removeStation(id, collection)
  }

  async getAllStations(collection: StorageCollectionName, type?: StorageType) {
    const { storage, type: resolvedType } = await this.resolveStorage(type)

    const stations = await storage.getStations(collection)

    //indexDb only holds station id, more data needs to be queried.
    if (resolvedType === 'local' && stations.length > 0) {
      // get station info
      const result = await this.httpClient('/api/station/bulk-info', {
        data: {
          stations
        }
      })

      return result
    } else {
      return stations
    }
  }

  async removeAllStations(
    collection: StorageCollectionName,
    type?: StorageType
  ) {
    const { storage } = await this.resolveStorage(type)

    return storage.removeAllStations(collection)
  }

  async countStationClick(id: string) {
    try {
      await this.httpClient('/api/station/click', { data: { id } })

      return true
    } catch (err) {
      // fail silently
      return false
      //TODO - log error
    }
  }

  async getStationInfo(id: string) {
    const [data] = await this.httpClient<RadioDTO[]>(
      `/api/station-info?play=${encodeURIComponent(id)}`
    )

    return data
  }
}
