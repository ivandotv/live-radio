import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { RadioStore } from 'lib/stores/radio-store'

let store: RadioStore

export function recentStationsFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new RadioStore(root, appStorageFactory())

  if (isSSR) return _store

  return (store = _store)
}
