import { AppShellStore } from 'lib/client/stores/app-shell-store'
import { MusicPlayerStore } from 'lib/client/stores/music-player-store'
import { RadioStore } from 'lib/client/stores/radio-store'
import { client } from 'lib/client/utils/misc-utils'
import { defaultStation, localDbName } from 'lib/shared/config'
import { isSSR } from 'lib/shared/utils'
import { configure } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { radioModelFactory } from '../radio-model'
import { AuthService } from '../services/auth-service'
import { SongInfoService } from '../services/song-info-service'
import { AppStorageService } from '../services/storage/app-storage-service'
import { LocalStorageService } from '../services/storage/local-storage-service'
import { RemoteStorageService } from '../services/storage/remote-storage-service'
import { StationTransport } from '../services/station-transport'

configure({ enforceActions: 'always' })
enableStaticRendering(typeof window === 'undefined')

let store: RootStore

export function rootStoreFactory() {
  if (isSSR() || !store) {
    store = new RootStore()
  }

  return store
}

//poor mans composition root
//TODO use dependency injection via: https://github.com/microsoft/tsyringe
export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: RadioStore

  recentStations: RadioStore

  constructor() {
    const storage = new AppStorageService(
      new LocalStorageService(localDbName),
      new RemoteStorageService(client),
      new AuthService(),
      client
    )

    const songInfoService = new SongInfoService(
      isSSR() ? fetch : fetch.bind(window)
    )

    this.appShell = new AppShellStore(this, storage)

    this.musicPlayer = new MusicPlayerStore(
      this,
      songInfoService,
      defaultStation
    )

    this.favoriteStations = new RadioStore(
      this,
      radioModelFactory,
      new StationTransport(storage, 'favorites')
    )

    this.recentStations = new RadioStore(
      this,
      radioModelFactory,
      new StationTransport(storage, 'recent')
    )
  }
}
