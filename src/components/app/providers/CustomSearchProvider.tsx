import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { CustomSearchStore } from '../../../lib/stores/CustomSearchStore'

enableStaticRendering(typeof window === 'undefined')
// todo store provider u posebnu klasu
let search: CustomSearchStore

const CustomSearchContext = createContext<CustomSearchStore | undefined>(
  undefined
)

export function useCustomSearch() {
  const context = useContext(CustomSearchContext)
  if (context === undefined) {
    throw new Error('useCustomSearch must be used within MusicPlayerProvider')
  }

  return context
}

export function CustomSearchProvider({ children }: { children: ReactNode }) {
  const player = initCustomSearch()

  // tmp
  useEffect(() => {
    window.search = player
  }, [])

  return (
    <CustomSearchContext.Provider value={player}>
      {children}
    </CustomSearchContext.Provider>
  )
}

function initCustomSearch() {
  const isSSR = typeof window === 'undefined'

  const transport = isSSR ? fetch : fetch.bind(window)

  const _search = search ?? new CustomSearchStore(transport)

  // For SSG and SSR always create a new store
  if (isSSR) return _search
  // Create the store once in the client
  if (!search) search = _search

  return _search
}
