import { FilterDataStore } from 'lib/stores/FilterDataStore'

export function filterDataStoreFactory(
  initialState: any[],
  uuid: string,
  indexes: string[],
  query?: string
) {
  //filter store can't be a singleton
  const store = new FilterDataStore()

  if (initialState) {
    store.hydrate(initialState, uuid, indexes, query)
  }

  return store
}
