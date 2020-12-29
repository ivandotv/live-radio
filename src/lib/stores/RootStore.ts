import { AppStorage, getLocalDB } from 'lib/LocalDB'
import { AppShellStore } from 'lib/stores/AppShellStore'
import { musicPlayerFactory } from 'lib/stores/factories/musicPlayerFactory'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { FavoritesStore } from './FavoritesStore'
import { favoriteStoreFactory } from './factories/favoriteStoreFactory'
import { appShellFactory } from './factories/appShellFactory'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  storage: AppStorage

  favorites: FavoritesStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.storage = getLocalDB()
    this.favorites = favoriteStoreFactory(this, this.storage)
  }
}
