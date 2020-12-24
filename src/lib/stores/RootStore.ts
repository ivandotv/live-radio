import { AppStorage, getLocalDB } from 'lib/LocalDB'
import { AppShellStore } from 'lib/stores/AppShellStore'
import { initMusicPlayer } from 'lib/stores/initializers/initMusicPlayerStore'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'
import { FavoritesStore } from './FavoritesStore'
import { initFavoritesStore } from './initializers/initFavoritesStore'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  storage: AppStorage

  favorites: FavoritesStore

  constructor() {
    this.appShell = new AppShellStore(this)
    this.musicPlayer = initMusicPlayer(this)
    this.storage = getLocalDB()
    this.favorites = initFavoritesStore(this, this.storage)
  }
}
