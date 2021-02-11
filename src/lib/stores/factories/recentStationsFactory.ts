import { appStorageFactory } from 'lib/storage/AppStorage'
import { RootStore } from 'lib/stores/RootStore'
import { RadioStore } from 'lib/stores/RadioStore'

let store: RadioStore

export function recentStationsFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new RadioStore(root, appStorageFactory())

  if (isSSR) return _store

  return (store = _store)
}
