import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { FavoriteStationsStore } from '../favorites-store'

let store: FavoriteStationsStore

export function favoritesFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  if (isSSR || !store) {
    store = new FavoriteStationsStore(root, appStorageFactory())
  }

  return store
}
