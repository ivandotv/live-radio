import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import {
  CustomSearchStore,
  customSearchFactory
} from 'lib/stores/custom-search-store'

enableStaticRendering(typeof window === 'undefined')

const CustomSearchContext =
  createContext<CustomSearchStore | undefined>(undefined)
CustomSearchContext.displayName = 'CustomSearchContext'

export function useCustomSearch() {
  const context = useContext(CustomSearchContext)
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
  const player = customSearchFactory()

  return (
    <CustomSearchContext.Provider value={player}>
      {children}
    </CustomSearchContext.Provider>
  )
}
