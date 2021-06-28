import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import {
  FilterDataStore,
  filterDataFactory
} from 'lib/stores/filter-data-store'

enableStaticRendering(typeof window === 'undefined')

const FilterDataContext = createContext<FilterDataStore | undefined>(undefined)
FilterDataContext.displayName = 'FilterDataContext'

export function useFilterDataStore() {
  const context = useContext(FilterDataContext)
  if (typeof context === 'undefined') {
    throw new Error('useStoreContext must be used within StoreProvider')
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
