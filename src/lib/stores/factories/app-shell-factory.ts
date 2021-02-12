import { AppShellStore } from 'lib/stores/app-shell-store'
import { RootStore } from 'lib/stores/root-store'

let store: AppShellStore

export function appShellFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new AppShellStore(root)

  if (isSSR) return _store

  return (store = _store)
}
