import { SongInfoService } from 'lib/SongInfoService'
import { appStorageFactory } from 'lib/storage/AppStorage'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { RootStore } from 'lib/stores/RootStore'
<<<<<<< HEAD
import { defaultStation } from 'lib/utils'
=======
import { getDefaultStation } from 'lib/stationUtils'
>>>>>>> 12ef997 (enable auth)

let store: MusicPlayerStore

export function musicPlayerFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  let _store
  if (!store) {
    const fetchImpl = isSSR ? fetch : fetch.bind(window)
    const songInfoService = new SongInfoService(fetchImpl)

    _store = new MusicPlayerStore(
      root,
<<<<<<< HEAD
      getLocalDB(),
      songInfoService,
      defaultStation
=======
      appStorageFactory(),
      songInfoService,
      getDefaultStation()
>>>>>>> 12ef997 (enable auth)
    )
  } else {
    _store = store
  }
  if (isSSR) return _store

  return (store = _store)
}
