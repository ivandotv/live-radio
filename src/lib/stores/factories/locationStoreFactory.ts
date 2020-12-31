import { LocationStore } from '../LocationStore'

let store: LocationStore
export function locationFactory() {
  const isSSR = typeof window === 'undefined'

  const fetchImpl = isSSR ? fetch : fetch.bind(window)

  const _store = store ?? new LocationStore(fetchImpl)

  if (isSSR) return _store

  return (store = _store)
}
