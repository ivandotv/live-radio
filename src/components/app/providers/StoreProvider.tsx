import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import { FilterDataStore } from '../../../lib/stores/FilterDataStore'
import { RadioStation } from '../ListStations'

enableStaticRendering(typeof window === 'undefined')
// todo store provider u posebnu klasu
let store: FilterDataStore
const StoreContext = createContext<FilterDataStore | undefined>(undefined)

export function useFilterDataStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStoreContext must be used within StoreProvider')
  }

  return context
}

export function FilterStoreProvider({
  children,
  initialState,
  uuid,
  indexes
}: {
  children: ReactNode
  initialState: RadioStation[]
  uuid: string
  indexes: string[]
}) {
  const store = initMyStore(initialState, uuid, indexes)

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function initMyStore(initialState: any[], uuid: string, indexes: string[]) {
  const _store = store ?? new FilterDataStore()

  console.log('init store')
  console.log('browser ', typeof window !== 'undefined')
  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (initialState) {
    _store.hydrate(initialState, uuid, indexes)
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}
