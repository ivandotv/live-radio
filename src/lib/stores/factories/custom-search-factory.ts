import { CustomSearchStore } from 'lib/stores/custom-search-store'

let store: CustomSearchStore

export function customSearchFactory() {
  const isSSR = typeof window === 'undefined'

  const transport = isSSR ? fetch : fetch.bind(window)

  const _store = store ?? new CustomSearchStore(transport)

  // For SSG and SSR always create a new store
  if (isSSR) return _store

  // Create the store once in the client
  return (store = _store)
}
