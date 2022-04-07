import { appShellFactory, AppShellStore } from 'lib/stores/app-shell-store'
import { RadioStore, radioStoreFactory } from 'lib/stores/radio-store'
import {
  musicPlayerFactory,
  MusicPlayerStore
} from 'lib/stores/music-player-store'
import { isSSR } from 'lib/utils/misc-utils'
import { configure } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

configure({ enforceActions: 'always' })
enableStaticRendering(typeof window === 'undefined')

let store: RootStore

export function rootStoreFactory() {
  if (isSSR() || !store) {
    store = new RootStore()
  }

  return store
}

export class RootStore {
  appShell: AppShellStore

  musicPlayer: MusicPlayerStore

  favoriteStations: RadioStore

  recentStations: RadioStore

  constructor() {
    this.appShell = appShellFactory(this)
    this.musicPlayer = musicPlayerFactory(this)
    this.favoriteStations = radioStoreFactory(this, 'favorites')
    this.recentStations = radioStoreFactory(this, 'recent')
  }
}
