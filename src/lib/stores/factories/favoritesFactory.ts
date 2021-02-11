import { appStorageFactory } from 'lib/storage/AppStorage'
import { RootStore } from 'lib/stores/RootStore'
import { RadioStore } from 'lib/stores//RadioStore'
// import { FavoritesStore } from '../FavoritesStore'

let store: RadioStore

export function favoritesFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  if (isSSR || !store) {
    store = new RadioStore(root, appStorageFactory())
  }

  return store
}
