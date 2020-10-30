import { enableStaticRendering } from 'mobx-react-lite'
import { useEffect, createContext, ReactNode, useContext } from 'react'
import { RootStore } from '../../../lib/stores/RootStore'

enableStaticRendering(typeof window === 'undefined')

let store: RootStore
const RootContext = createContext<RootStore | undefined>(undefined)

export function useRootStore() {
  const context = useContext(RootContext)
  if (typeof context === 'undefined') {
    throw new Error('useRootStore must be called within RootStoreProvider')
  }

  return context
}

export function useAppShell() {
  const { appShell } = useRootStore()

  return appShell
}
export function useMusicPlayer() {
  const { musicPlayer } = useRootStore()

  return musicPlayer
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

  return <RootContext.Provider value={root}>{children}</RootContext.Provider>
}

export function getRootStore() {
  const isSSR = typeof window === 'undefined'
  const _store = store ?? new RootStore()

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  // if (initialState) {
  //   _store.hydrate(initialState)
  // }
  // For SSG and SSR always create a new store
  if (isSSR) return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}
