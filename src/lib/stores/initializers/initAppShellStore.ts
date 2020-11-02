import { AppShellStore } from 'lib/stores/AppShellStore'
import { RootStore } from 'lib/stores/RootStore'

let store: AppShellStore

export function initMusicPlayer(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new AppShellStore(root)

  if (isSSR) return _store

  if (!store) store = _store

  return _store
}
