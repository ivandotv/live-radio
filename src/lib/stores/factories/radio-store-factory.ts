import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { RecentStationsStore } from '../recent-store'

let store: RecentStationsStore

export function recentStationsFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new RecentStationsStore(root, appStorageFactory())

  if (isSSR) return _store

  return (store = _store)
}
