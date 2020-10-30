import { AppShellStore } from './AppShellStore'
import { initMusicPlayer } from './initializers/initMusicPlayerStore'
import { MusicPlayerStore } from './MusicPlayerStore'

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  constructor() {
    this.appShell = new AppShellStore(this)
    this.musicPlayer = initMusicPlayer(this)
  }
}
