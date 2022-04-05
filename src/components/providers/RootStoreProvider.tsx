import { RootStore, rootStoreFactory } from 'lib/stores/root-store'
import { createContext, ReactNode, useContext, useEffect } from 'react'

const RootStoreContext = createContext<RootStore | undefined>(undefined)
RootStoreContext.displayName = 'RootStoreContext'

export function useRootStore() {
  const context = useContext(RootStoreContext)
  if (typeof context === 'undefined') {
    throw new Error('useRootStore must be called within RootStoreProvider')
  }

  return context
}

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const rootStore = rootStoreFactory()

  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-expect-errors - dev only
      window.rootStore = rootStore
    }, [rootStore])
  }

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}
