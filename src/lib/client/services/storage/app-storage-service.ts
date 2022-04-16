import { AuthService } from 'lib/client/services/auth-service'
import { client } from 'lib/client/utils/misc-utils'
import { isSSR } from 'lib/shared/utils'
import { RadioDTO } from 'lib/shared/utils'
import { Session } from 'next-auth'
import { LocalStorageService } from './local-storage-service'
import { RemoteStorageService } from './remote-storage-service'

let instance: AppStorageService
const localDbName = 'LiveRadio'

export type StorageType = 'local' | 'remote'
export type StorageCollection = 'favorites' | 'recent'

export function appStorageFactory() {
  if (isSSR() || !instance) {
    instance = new AppStorageService(
      new LocalStorageService(localDbName),
      new RemoteStorageService(client),
      new AuthService(),
      client
    )
  }

  return instance
}

export class AppStorageService {
  protected session: Session | null = null

  protected resolved = false

  constructor(
    protected local: LocalStorageService,
    protected remote: RemoteStorageService,
    protected authService: AuthService,
    protected httpClient: typeof client
  ) {}

  protected async resolveStorage(type?: StorageType) {
    //short circuit session check
    if ('local' === type) return this.local
    if ('remote' === type) return this.remote

    const session = await this.authService.getAuth()
    if (session) {
      return this.remote
    }

    return this.local
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

    await Promise.all([
      localFavs.length
        ? this.remote.importStations(localFavs, 'favorites')
        : undefined,
      localRecent.length
        ? this.remote.importStations(localRecent, 'recent')
        : undefined
    ])

    if (deleteAll) {
      Promise.all([
        this.local.removeAllStations('favorites'),
        this.local.removeAllStations('recent')
      ])
    }

    return {
      favorites: localFavs,
      recent: localRecent
    }
  }

  async saveStation(station: RadioDTO, collection: StorageCollection) {
    const storage = await this.resolveStorage()

    return storage.addStation(station, collection)
  }

  async removeStation(id: string, collection: StorageCollection) {
    const storage = await this.resolveStorage()

    return storage.removeStation(id, collection)
  }

  async getAllStations(collection: StorageCollection, type?: StorageType) {
    const storage = await this.resolveStorage(type)

    return storage.getStations(collection)
  }

  async removeAllStations(collection: StorageCollection, type?: StorageType) {
    const storage = await this.resolveStorage(type)

    return storage.removeAllStations(collection)
  }

  async countStationClick(id: string) {
    try {
      await this.httpClient('/api/station-click', { data: { id } })

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
