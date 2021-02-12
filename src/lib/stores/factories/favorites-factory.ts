import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { RadioStore } from 'lib/stores/radio-store'
// import { FavoritesStore } from '../FavoritesStore'

let store: RadioStore

export function favoritesFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  if (isSSR || !store) {
    store = new RadioStore(root, appStorageFactory())
  }

  return store
}
