import { RadioStation } from 'lib/station-utils'
import { client } from 'lib/utils'
import { RadioStore } from './radio-store'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { isSSR } from 'lib/utils'

let store: FavoriteStationsStore

export function favoritesFactory(root: RootStore) {
  const isServer = isSSR()

  if (isServer || !store) {
    store = new FavoriteStationsStore(root, appStorageFactory())
  }

  return store
}

export class FavoriteStationsStore extends RadioStore {
  protected addStation(station: RadioStation): Promise<any> {
    return this.storage.addFavoriteStation(station)
  }

  async add(station: RadioStation, optimistic = false) {
    await super.add(station, optimistic)
    try {
      await client('/api/vote-for-station', { data: { id: station._id } })
    } catch (e) {
      //TODO -log error
    }
  }

  protected resolveStations() {
    return this.storage.getFavoriteStations()
  }

  protected removeStation(id: string) {
    return this.storage.removeFavoriteStation(id)
  }
}
