import { FilterDataStore } from 'lib/stores/filter-data-store'

export function filterDataFactory(
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
