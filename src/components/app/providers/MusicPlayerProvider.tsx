import { ReactNode, useContext, useEffect, createContext } from 'react'
import { MusicPlayerStore } from '../../../lib/stores/MusicPlayerStore'
import { RadioStation } from '../ListData'
import { enableStaticRendering } from 'mobx-react-lite'
import { LocalStorage, LocalStorageSSR } from '../../../lib/Storage'
import { SongInfoService } from '../../../lib/SongInfoService'

enableStaticRendering(typeof window === 'undefined')
// todo store provider u posebnu klasu
let player: MusicPlayerStore
const MusicPlayerContext = createContext<MusicPlayerStore | undefined>(
  undefined
)

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error(
      'useMusicPlayerStore must be used within MusicPlayerProvider'
    )
  }

  return context
}

export function MainProvider({ children }: { children: ReactNode }) {
  const player = initMusicPlayer()

  // tmp
  useEffect(() => {
    window.player = player
  }, [])

  return (
    <MusicPlayerContext.Provider value={player}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

function initMusicPlayer() {
  const isSSR = typeof window === 'undefined'

  const storage = isSSR
    ? LocalStorageSSR
    : new LocalStorage(window.localStorage)
  const fetchImpl = isSSR ? fetch : fetch.bind(window)
  const songInfoService = new SongInfoService(fetchImpl)

  const _player = player ?? new MusicPlayerStore(storage, songInfoService)

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  // if (initialState) {
  //   _store.hydrate(initialState)
  // }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _player
  // Create the store once in the client
  if (!player) player = _player

  return _player
}
