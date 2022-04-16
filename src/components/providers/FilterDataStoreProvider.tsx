import {
  filterDataFactory,
  FilterDataStore
} from 'lib/client/stores/filter-data-store'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo } from 'react'

enableStaticRendering(typeof window === 'undefined')

const FilterDataContext = createContext<FilterDataStore | undefined>(undefined)

FilterDataContext.displayName = 'FilterDataContext'

export function useFilterDataStore() {
  const context = useContext(FilterDataContext)
  if (typeof context === 'undefined') {
    throw new Error(
      'useFilterDataStore must be used within FilterDataStoreProvider'
    )
  }

  return context
}

export function FilterDataStoreProvider({
  children,
  initialState,
  uuid,
  indexes,
  query
}: {
  children: ReactNode
  initialState: any[]
  uuid: string
  indexes: string[]
  query?: string
}) {
  const store = useMemo(() => {
    return filterDataFactory(initialState, uuid, indexes, query)
  }, [initialState, uuid, indexes, query])

  return (
    <FilterDataContext.Provider value={store}>
      {children}
    </FilterDataContext.Provider>
  )
}
