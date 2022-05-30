import { Collection } from '@fuerte/core'
import { AppShellStore } from 'lib/client/stores/app-shell-store'
import { MusicPlayerStore } from 'lib/client/stores/music-player-store'
import { RadioStore } from 'lib/client/stores/radio-store'
import { client } from 'lib/client/utils/misc-utils'
import { SHARED_CONFIG } from 'lib/shared/config'
import { isSSR } from 'lib/shared/utils'
import { getSession } from 'next-auth/react'
import { PumpIt, SCOPE } from 'pumpit'
import { radioModelFactory } from './radio-model'
import { AuthService } from './services/auth-service'
import { SongInfoService } from './services/song-info-service'
import { StationTransport } from './services/station-transport'
import { LocalStorageService } from './services/storage/local-storage-service'
import { RemoteStorageService } from './services/storage/remote-storage-service'
import {
  StorageCollectionName,
  StorageService
} from './services/storage/storage-service'
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
  .bindClass(StorageService, StorageService, {
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
  .bindClass(AppShellStore, AppShellStore, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(MusicPlayerStore, MusicPlayerStore, {
    scope: SCOPE.SINGLETON
  })
  .bindClass(StationTransport, StationTransport)
  .bindClass('favoritesRadioStore', RadioStore, {
    beforeResolve: ({ container, value }, ...deps) => {
      return new value(deps[0], container.resolve('favoritesCollection'))
    },
    scope: SCOPE.SINGLETON
  })
  .bindClass('recentRadioStore', RadioStore, {
    beforeResolve: ({ container, value }, ...deps) => {
      return new value(deps[0], container.resolve('recentCollection'))
    },
    scope: SCOPE.SINGLETON
  })
  .bindValue('sharedConfig', SHARED_CONFIG)
  .bindValue(client, client)
  .bindValue(radioModelFactory, radioModelFactory)
  .bindClass('recentTransport', StationTransport, {
    beforeResolve: ({ value }, ...deps) => {
      const name: StorageCollectionName = 'recent'

      return new value(deps[0], name)
    },
    scope: SCOPE.SINGLETON
  })
  .bindClass('favoritesTransport', StationTransport, {
    beforeResolve: ({ value }, ...deps) => {
      const name: StorageCollectionName = 'favorites'

      return new value(deps[0], name)
    },
    scope: SCOPE.SINGLETON
  })
  .bindClass(
    'favoritesCollection',
    { value: Collection, inject: [radioModelFactory, 'favoritesTransport'] },
    { scope: SCOPE.SINGLETON }
  )
  .bindClass(
    'recentCollection',
    { value: Collection, inject: [radioModelFactory, 'recentTransport'] },
    { scope: SCOPE.SINGLETON }
  )
  .bindValue(getSession, getSession)
