import { AppShellStore } from 'lib/stores/app-shell-store'
import { musicPlayerFactory } from 'lib/stores/factories/music-player-factory'
import { MusicPlayerStore } from 'lib/stores/music-player-store'
import { appShellFactory } from './factories/app-shell-factory'
import { favoritesFactory } from './factories/favorites-factory'
import { recentStationsFactory } from './factories/recent-stations-factory'
import { RadioStore } from './radio-store'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: RadioStore

  recentStations: RadioStore

  constructor() {
    console.log('root store constructor')
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = favoritesFactory(this)
    this.recentStations = recentStationsFactory(this)
  }
}
