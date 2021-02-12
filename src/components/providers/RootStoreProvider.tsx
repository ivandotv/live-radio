import { enableStaticRendering } from 'mobx-react-lite'
import { useEffect, createContext, ReactNode, useContext } from 'react'
import { RootStore } from 'lib/stores/root-store'

enableStaticRendering(typeof window === 'undefined')

let store: RootStore
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
  const root = getRootStore()

  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-ignore
      window.rootStore = root
    }, [root])
  }

  return (
    <RootStoreContext.Provider value={root}>
      {children}
    </RootStoreContext.Provider>
  )
}

export function getRootStore() {
  const isSSR = typeof window === 'undefined'
  const _store = store ?? new RootStore()

  if (isSSR) return _store

  return (store = _store)
}
