import { AppShellStore } from 'lib/client/stores/app-shell-store'
import { MusicPlayerStore } from 'lib/client/stores/music-player-store'
import { RadioStore } from 'lib/client/stores/radio-store'
import { client } from 'lib/client/utils/misc-utils'
import { defaultStation, localDbName } from 'lib/shared/config'
import { isSSR } from 'lib/shared/utils'
import { PumpIt, SCOPE } from 'pumpit'
import { radioModelFactory } from './radio-model'
import { AuthService } from './services/auth-service'
import { SongInfoService } from './services/song-info-service'
import { StationTransport } from './services/station-transport'
import { AppStorageService } from './services/storage/app-storage-service'
import { LocalStorageService } from './services/storage/local-storage-service'
import { RemoteStorageService } from './services/storage/remote-storage-service'
import { RootStore } from './stores/root-store'

let store: RootStore

export function rootStoreFactory() {
  if (isSSR() || !store) {
    store = injectionContainer.resolve<RootStore>(RootStore)
  }

  return store
}

export const injectionContainer = new PumpIt()

injectionContainer
  .bindFactory(fetch, () => {
    return isSSR() ? fetch : fetch.bind(window)
  })
  .bindClass(RootStore, RootStore)
  .bindClass(AppStorageService, AppStorageService, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(LocalStorageService, LocalStorageService, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(RemoteStorageService, RemoteStorageService, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(AuthService, AuthService, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(SongInfoService, SongInfoService, {
    scope: SCOPE.SINGLETON
  })
  //circular dependencies need to use string or symbols as keys
  .bindClass('AppShellStore', AppShellStore, {
    scope: SCOPE.SINGLETON
  })
  .bindClass('MusicPlayerStore', MusicPlayerStore, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(StationTransport, StationTransport)
  .bindClass('FavoritesRadioStore', RadioStore, {
    beforeResolve: ({ value, deps }) => {
      // @ts-expect-error added deps
      return new value(...deps, 'favorites')
    }
  })
  .bindClass('RecentRadioStore', RadioStore, {
    beforeResolve: ({ value, deps }) => {
      // @ts-expect-error added deps
      return new value(...deps, 'recent')
    }
  })
  .bindValue(localDbName, localDbName)
  .bindValue(client, client)
  .bindValue(defaultStation, defaultStation)
  .bindValue(radioModelFactory, radioModelFactory)