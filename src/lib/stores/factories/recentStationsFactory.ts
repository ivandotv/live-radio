import { getLocalDB } from 'lib/LocalDB'
import { RootStore } from 'lib/stores/RootStore'
import { RecentStationsStore } from '../RecentStationsStore'

let store: RecentStationsStore

export function recentStationsFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const _store = store ?? new RecentStationsStore(root, getLocalDB())

  if (isSSR) return _store

  return (store = _store)
}
