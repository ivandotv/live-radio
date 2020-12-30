import { AppShellStore } from 'lib/stores/AppShellStore'
import { musicPlayerFactory } from 'lib/stores/factories/musicPlayerFactory'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { appShellFactory } from './factories/appShellFactory'
import { favoriteStoreFactory } from './factories/favoriteStoreFactory'
import { FavoritesStore } from './FavoritesStore'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favorites: FavoritesStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favorites = favoriteStoreFactory(this)
  }
}
