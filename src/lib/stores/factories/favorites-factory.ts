import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { RootStore } from 'lib/stores/root-store'
import { RadioStore } from 'lib/stores/radio-store'
import { FavoritesStore } from '../favorites-store'
import { RadioBrowserApi } from 'radio-browser-api'
import { userAgentName } from 'app-config'

let store: RadioStore

export function favoritesFactory(root: RootStore) {
  const isSSR = typeof window === 'undefined'

  const fetchImpl = isSSR ? fetch : fetch.bind(window)
  if (isSSR || !store) {
    store = new FavoritesStore(
      root,
      appStorageFactory(),
      new RadioBrowserApi(fetchImpl, userAgentName, true)
    )
  }

  return store
}
