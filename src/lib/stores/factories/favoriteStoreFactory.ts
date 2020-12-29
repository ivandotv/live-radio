import { AppStorage } from 'lib/LocalDB'
import { RootStore } from 'lib/stores/RootStore'
import { FavoritesStore } from '../FavoritesStore'

let store: FavoritesStore

export function favoriteStoreFactory(root: RootStore, storage: AppStorage) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new FavoritesStore(root, storage)

  if (isSSR) return _store

  return (store = _store)
}
