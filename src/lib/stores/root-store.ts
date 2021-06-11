import { AppShellStore } from 'lib/stores/app-shell-store'
import { musicPlayerFactory } from 'lib/stores/factories/music-player-factory'
import { MusicPlayerStore } from 'lib/stores/music-player-store'
import { appShellFactory } from './factories/app-shell-factory'
import { favoritesFactory } from './factories/favorites-factory'
import { recentStationsFactory } from './factories/radio-store-factory'
import { serviceWorkerFactory } from './factories/service-worker-factory'
import { RadioStore } from './radio-store'
import { ServiceWorkerStore } from './service-worker-store'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: RadioStore

  recentStations: RadioStore

  serviceWorker: ServiceWorkerStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = favoritesFactory(this)
    this.recentStations = recentStationsFactory(this)
    this.serviceWorker = serviceWorkerFactory()
  }
}
