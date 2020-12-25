import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { FilterDataStore } from 'lib/stores/FilterDataStore'
import { initFilterDataStore } from 'lib/stores/initializers/initFilterDataStore'

enableStaticRendering(typeof window === 'undefined')

const ctx = createContext<FilterDataStore | undefined>(undefined)

export function useFilterDataStore() {
  const context = useContext(ctx)
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
    return initFilterDataStore(initialState, uuid, indexes, query)
  }, [initialState, uuid, indexes, query])

  return <ctx.Provider value={store}>{children}</ctx.Provider>
}
