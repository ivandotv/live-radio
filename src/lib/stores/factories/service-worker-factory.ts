import { ServiceWorkerStore } from 'lib/stores/service-worker-store'

let store: ServiceWorkerStore

export function serviceWorkerFactory() {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new ServiceWorkerStore()

  if (isSSR) return _store

  return (store = _store)
}
