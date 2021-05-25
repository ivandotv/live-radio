import { LocationStore } from '../location-store'

let store: LocationStore
export function locationFactory() {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new LocationStore()

  if (isSSR) return _store

  return (store = _store)
}
