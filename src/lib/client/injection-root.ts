import { Collection } from '@fuerte/core'
import { radioModelFactory } from 'lib/client/radio-model'
import { AuthService } from 'lib/client/services/auth-service'
import { SongInfoService } from 'lib/client/services/song-info-service'
import { StationTransport } from 'lib/client/services/station-transport'
import { LocalStorageService } from 'lib/client/services/storage/local-storage-service'
import { RemoteStorageService } from 'lib/client/services/storage/remote-storage-service'
import { StorageService } from 'lib/client/services/storage/storage-service'
import { AppShellStore } from 'lib/client/stores/app-shell-store'
import { MusicPlayerStore } from 'lib/client/stores/music-player-store'
import { RadioStore } from 'lib/client/stores/radio-store'
import { RootStore } from 'lib/client/stores/root-store'
import { SHARED_CONFIG } from 'lib/shared/config'
import { client } from 'lib/shared/fetch-client'
import { isSSR } from 'lib/shared/utils'
import { getSession } from 'next-auth/react'
import { PumpIt, SCOPE } from 'pumpit'
import { CustomSearchStore } from './stores/custom-search-store'

let store: RootStore
let container: PumpIt

export function rootStoreFactory() {
  if (isSSR() || !store) {
    store = getClientContainer().resolve<RootStore>(RootStore)
  }

  return store
}

export function getClientContainer() {
  if (!container) {
    container = new PumpIt()
      .bindFactory(fetch, () => {
        return isSSR() ? fetch : fetch.bind(window)
      })
      .bindClass(RootStore, RootStore)
      .bindClass(StorageService, StorageService, {
        scope: SCOPE.SINGLETON
      })
      .bindClass(CustomSearchStore, CustomSearchStore, {
        scope: SCOPE.CONTAINER_SINGLETON
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
        afterResolve: ({ value }: { value: RadioStore }) => {
          value.setCollectionNanme('favorites')
        },
        scope: SCOPE.SINGLETON
      })
      .bindClass('recentRadioStore', RadioStore, {
        afterResolve: ({ value }: { value: RadioStore }) => {
          value.setCollectionNanme('recent')
        },
        scope: SCOPE.SINGLETON
      })
      .bindValue('sharedConfig', SHARED_CONFIG)
      .bindValue(client, client)
      .bindValue(radioModelFactory, radioModelFactory)
      .bindClass(Collection, {
        value: Collection,
        inject: [radioModelFactory, StationTransport]
      })
      .bindValue(getSession, getSession)
  }

  return container
}
