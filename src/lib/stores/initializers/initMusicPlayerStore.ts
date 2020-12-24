import { LocalStorage, LocalStorageSSR } from 'lib/Storage'
import { SongInfoService } from 'lib/SongInfoService'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { RootStore } from 'lib/stores/RootStore'

let store: MusicPlayerStore

export function initMusicPlayer(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  //todo - ovaj storage izbrisati
  const storage = isSSR
    ? LocalStorageSSR
    : new LocalStorage(window.localStorage)
  const fetchImpl = isSSR ? fetch : fetch.bind(window)
  const songInfoService = new SongInfoService(fetchImpl)

  const _store = store ?? new MusicPlayerStore(root, storage, songInfoService)

  if (isSSR) return _store

  if (!store) store = _store

  return _store
}
