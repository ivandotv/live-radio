import { getLocalDB } from 'lib/LocalDB'
import { RootStore } from 'lib/stores/RootStore'
import { FavoritesStore } from '../FavoritesStore'

let store: FavoritesStore

export function favoriteStoreFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new FavoritesStore(root, getLocalDB())

  if (isSSR) return _store

  return (store = _store)
}
