import { getLocalDB } from 'lib/LocalDB'
import { SongInfoService } from 'lib/SongInfoService'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { RootStore } from 'lib/stores/RootStore'

let store: MusicPlayerStore

export function musicPlayerFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  let _store
  if (!store) {
    const fetchImpl = isSSR ? fetch : fetch.bind(window)
    const songInfoService = new SongInfoService(fetchImpl)

    _store = new MusicPlayerStore(root, getLocalDB(), songInfoService)
  } else {
    _store = store
  }
  if (isSSR) return _store

  return (store = _store)
}
