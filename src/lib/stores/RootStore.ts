import { AppShellStore } from 'lib/stores/AppShellStore'
import { musicPlayerFactory } from 'lib/stores/factories/musicPlayerFactory'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { appShellFactory } from './factories/appShellFactory'
import { favoritesFactory } from './factories/favoritesFactory'
import { recentStationsFactory } from './factories/recentStationsFactory'
import { RadioStore } from './RadioStore'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: RadioStore

  recentStations: RadioStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = favoritesFactory(this)
    this.recentStations = recentStationsFactory(this)
  }
}
