import { RadioStation } from 'lib/station-utils'
import { RadioStore } from './radio-store'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { isSSR } from 'lib/utils'

let store: RecentStationsStore

export function recentStationsFactory(root: RootStore) {
  const isServer = isSSR()
  const _store = store ?? new RecentStationsStore(root, appStorageFactory())

  if (isServer) return _store

  return (store = _store)
}

export class RecentStationsStore extends RadioStore {
  protected addStation(station: RadioStation): Promise<any> {
    return this.storage.addRecentStation(station)
  }

  protected resolveStations() {
    return this.storage.getRecentStations()
  }

  protected removeStation(id: string) {
    return this.storage.removeRecentStation(id)
  }
}
