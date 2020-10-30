import { FilterDataStore } from '../FilterDataStore'

let store: FilterDataStore

export function initFilterDataStore(
  initialState: any[],
  uuid: string,
  indexes: string[]
) {
  const _store = store ?? new FilterDataStore()

  if (initialState) {
    _store.hydrate(initialState, uuid, indexes)
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  // if (!store) store = _store

  return _store
}
