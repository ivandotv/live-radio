import { ServiceWorkerStore } from 'lib/stores/service-worker-store'
import { RootStore } from '../root-store'

let store: ServiceWorkerStore

export function serviceWorkerFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new ServiceWorkerStore(root)

  if (isSSR) return _store

  return (store = _store)
}
