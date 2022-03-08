import { AuthService } from 'lib/services/auth-service'
import { RadioDTO } from 'lib/utils/station-utils'
import { client, isSSR } from 'lib/utils/misc-utils'
import { Session } from 'next-auth'
import { LocalStorageService } from './local-storage-service'
import { RemoteStorageService } from './remote-storage-service'

let instance: AppStorageService
const localDbName = 'LiveRadio'

export type STORAGE_TYPE = 'local' | 'remote'

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

  protected async resolveStorage(type?: STORAGE_TYPE) {
    //short circuit session check
    if ('local' === type) return this.local
    if ('remote' === type) return this.remote

    const session = await this.authService.getAuth()
    if (session) {
      return this.remote
    }

    return this.local
  }

  async getFavoriteStations(type?: STORAGE_TYPE): Promise<RadioDTO[]> {
    const storage = await this.resolveStorage(type)

    return storage.getStations('favorites')
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
        ? this.remote.importStations(localFavs, 'favorites') // todo - should be one call over the wire
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

  async addFavoriteStation(station: RadioDTO) {
    const storage = await this.resolveStorage()

    return storage.addStation(station, 'favorites')
  }

  async removeFavoriteStation(id: string) {
    const storage = await this.resolveStorage()

    return storage.removeStation(id, 'favorites')
  }

  async getRecentStations(type?: STORAGE_TYPE) {
    const storage = await this.resolveStorage(type)

    return storage.getStations('recent')
  }

  async addRecentStation(station: RadioDTO) {
    const storage = await this.resolveStorage()

    return storage.addStation(station, 'recent')
  }

  async removeRecentStation(id: string) {
    const storage = await this.resolveStorage()

    return storage.removeStation(id, 'recent')
  }

  async removeAllFavoriteStations(type?: STORAGE_TYPE) {
    const storage = await this.resolveStorage(type)

    return storage.removeAllStations('favorites')
  }

  async removeAllRecentStations(type?: STORAGE_TYPE) {
    const storage = await this.resolveStorage(type)

    return storage.removeAllStations('recent')
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
