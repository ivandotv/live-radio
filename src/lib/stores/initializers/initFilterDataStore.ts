import { FilterDataStore } from 'lib/stores/FilterDataStore'

export function initFilterDataStore(
  initialState: any[],
  uuid: string,
  indexes: string[],
  query?: string
) {
  //filter store can't be singleton
  const store = new FilterDataStore()

  if (initialState) {
    store.hydrate(initialState, uuid, indexes, query)
  }

  return store
}
