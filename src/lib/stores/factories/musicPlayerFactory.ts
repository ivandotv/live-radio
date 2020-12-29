import { LocalStorage, LocalStorageSSR } from 'lib/Storage'
import { SongInfoService } from 'lib/SongInfoService'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { RootStore } from 'lib/stores/RootStore'

let store: MusicPlayerStore

export function musicPlayerFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  let _store
  if (!store) {
    const storage = isSSR
      ? LocalStorageSSR
      : new LocalStorage(window.localStorage)
    const fetchImpl = isSSR ? fetch : fetch.bind(window)
    const songInfoService = new SongInfoService(fetchImpl)

    _store = new MusicPlayerStore(root, storage, songInfoService)
  } else {
    _store = store
  }
  if (isSSR) return _store

  return (store = _store)
}
