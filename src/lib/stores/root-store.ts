import { AppShellStore, appShellFactory } from 'lib/stores/app-shell-store'
import {
  MusicPlayerStore,
  musicPlayerFactory
} from 'lib/stores/music-player-store'
import { FavoriteStationsStore, favoritesFactory } from './favorites-store'
import { RecentStationsStore, recentStationsFactory } from './recent-store'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: FavoriteStationsStore

  recentStations: RecentStationsStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = favoritesFactory(this)
    this.recentStations = recentStationsFactory(this)
  }
}
