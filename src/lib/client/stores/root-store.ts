import { AppShellStore } from 'lib/client/stores/app-shell-store'
import { MusicPlayerStore } from 'lib/client/stores/music-player-store'
import { RadioStore } from 'lib/client/stores/radio-store'
import { configure } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

configure({ enforceActions: 'always' })
enableStaticRendering(typeof window === 'undefined')

export class RootStore {
  static inject = [
    'AppShellStore',
    'MusicPlayerStore',
    'FavoritesRadioStore',
    'RecentRadioStore'
  ]

  constructor(
    public appShell: AppShellStore,
    public musicPlayer: MusicPlayerStore,
    public favoriteStations: RadioStore,
    public recentStations: RadioStore
  ) {}
}
