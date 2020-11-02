import { AppShellStore } from 'lib/stores/AppShellStore'
import { initMusicPlayer } from 'lib/stores/initializers/initMusicPlayerStore'
import { MusicPlayerStore } from 'lib/stores/MusicPlayerStore'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  constructor() {
    this.appShell = new AppShellStore(this)
    this.musicPlayer = initMusicPlayer(this)
  }
}
