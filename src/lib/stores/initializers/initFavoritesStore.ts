import { AppStorage } from 'lib/LocalDB'
import { RootStore } from 'lib/stores/RootStore'
import { FavoritesStore } from '../FavoritesStore'

let store: FavoritesStore

export function initFavoritesStore(root: RootStore, storage: AppStorage) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new FavoritesStore(root, storage)

  if (isSSR) return _store

  if (!store) store = _store

  return _store
}
