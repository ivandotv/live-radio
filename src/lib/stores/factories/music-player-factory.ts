import { SongInfoService } from 'lib/services/song-info-service'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { MusicPlayerStore } from 'lib/stores/music-player-store'
import { RootStore } from 'lib/stores/root-store'
import { getDefaultStation } from 'lib/station-utils'
import { RadioBrowserApi } from 'radio-browser-api'
import { userAgentName } from 'app-config'

let store: MusicPlayerStore

export function musicPlayerFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  let _store
  if (!store) {
    const fetchImpl = isSSR ? fetch : fetch.bind(window)
    const songInfoService = new SongInfoService(fetchImpl)

    _store = new MusicPlayerStore(
      root,
      appStorageFactory(),
      songInfoService,
      getDefaultStation(),
      new RadioBrowserApi(fetchImpl, userAgentName, true)
    )
  } else {
    _store = store
  }
  if (isSSR) return _store

  return (store = _store)
}
