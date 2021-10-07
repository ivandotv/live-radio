import { appShellFactory, AppShellStore } from 'lib/stores/app-shell-store'
import {
  FavoritesStore,
  favoritesStoreFactory
} from 'lib/stores/favorites-store'
import {
  musicPlayerFactory,
  MusicPlayerStore
} from 'lib/stores/music-player-store'
import { isSSR } from 'lib/utils'
import { enableStaticRendering } from 'mobx-react-lite'
import { RecentStore, recentStoreFactory } from './recent-store'

enableStaticRendering(typeof window === 'undefined')

let store: RootStore

export function rootStoreFactory() {
  if (isSSR() || !store) {
    store = new RootStore()
  }

  return store
}

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: FavoritesStore

  recentStations: RecentStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = favoritesStoreFactory(this)
    this.recentStations = recentStoreFactory(this)
  }
}
