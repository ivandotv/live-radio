import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import { CustomSearchStore } from 'lib/stores/CustomSearchStore'
import { initCustomSearchStore } from 'lib/stores/initializers/initCustomSearchStore'

enableStaticRendering(typeof window === 'undefined')

const ctx = createContext<CustomSearchStore | undefined>(undefined)

export function useCustomSearch() {
  const context = useContext(ctx)
  if (typeof context === 'undefined') {
    throw new Error('useCustomSearch must be used within CustomSearchProvider')
  }

  return context
}

export function CustomSearchStoreProvider({
  children
}: {
  children: ReactNode
}) {
  const player = initCustomSearchStore()

  return <ctx.Provider value={player}>{children}</ctx.Provider>
}
