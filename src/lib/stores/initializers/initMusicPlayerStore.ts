import { LocalStorage, LocalStorageSSR } from 'lib/Storage'
import { SongInfoService } from 'lib/SongInfoService'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { RootStore } from 'lib/stores/RootStore'

let store: MusicPlayerStore

export function initMusicPlayer(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const storage = isSSR
    ? LocalStorageSSR
    : new LocalStorage(window.localStorage)
  const fetchImpl = isSSR ? fetch : fetch.bind(window)
  const songInfoService = new SongInfoService(fetchImpl)

  const _player = store ?? new MusicPlayerStore(root, storage, songInfoService)

  if (isSSR) return _player

  if (!store) store = _player

  return _player
}
