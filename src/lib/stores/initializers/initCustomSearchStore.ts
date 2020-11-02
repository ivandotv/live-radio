import { CustomSearchStore } from 'lib/stores/CustomSearchStore'

let store: CustomSearchStore

export function initCustomSearchStore() {
  const isSSR = typeof window === 'undefined'

  const transport = isSSR ? fetch : fetch.bind(window)

  const _store = store ?? new CustomSearchStore(transport)

  // For SSG and SSR always create a new store
  if (isSSR) return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}
