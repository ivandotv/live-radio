import { LocationStore } from '../LocationStore'

let store: LocationStore
export function locationStoreFactory() {
  const isSSR = typeof window === 'undefined'

  const fetchImpl = isSSR ? fetch : fetch.bind(window)

  const _store = store ?? new LocationStore(fetchImpl)

  if (isSSR) return _store

  if (!store) store = _store

  return _store
}
