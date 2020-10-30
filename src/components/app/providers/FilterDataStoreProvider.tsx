import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { FilterDataStore } from '../../../lib/stores/FilterDataStore'
import { initFilterDataStore } from '../../../lib/stores/initializers/initFilterDataStore'
// import { RadioStation } from '../ListData'

enableStaticRendering(typeof window === 'undefined')

const StoreContext = createContext<FilterDataStore | undefined>(undefined)

export function useFilterDataStore() {
  const context = useContext(StoreContext)
  if (typeof context === 'undefined') {
    throw new Error('useStoreContext must be used within StoreProvider')
  }

  return context
}

export function FilterDataStoreProvider({
  children,
  initialState,
  uuid,
  indexes
}: {
  children: ReactNode
  initialState: any[]
  uuid: string
  indexes: string[]
}) {
  // console.log('provider initial state')
  // console.log(initialState)
  const store = useMemo(() => {
    return initFilterDataStore(initialState, uuid, indexes)
  }, [initialState, uuid, indexes])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
