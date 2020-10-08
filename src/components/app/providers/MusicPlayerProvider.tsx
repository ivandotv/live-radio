import { ReactNode, useContext, useEffect, createContext } from 'react'
import { MusicPlayerStore } from '../../../lib/stores/MusicPlayerStore'
import { RadioStation } from '../ListData'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')
// todo store provider u posebnu klasu
let store: MusicPlayerStore
const MusicPlayerContext = createContext<MusicPlayerStore | undefined>(
  undefined
)

export function useMusicPlayerStore() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error(
      'useMusicPlayerStore must be used within MusicPlayerProvider'
    )
  }

  return context
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const store = initMyStore()

  return (
    <MusicPlayerContext.Provider value={store}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

function initMyStore() {
  const _store = store ?? new MusicPlayerStore()

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  // if (initialState) {
  //   _store.hydrate(initialState)
  // }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}
