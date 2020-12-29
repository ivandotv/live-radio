import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import { CustomSearchStore } from 'lib/stores/CustomSearchStore'
import { initCustomSearchStore } from 'lib/stores/initializers/initCustomSearchStore'

enableStaticRendering(typeof window === 'undefined')

const CustomSearchContext = createContext<CustomSearchStore | undefined>(
  undefined
)
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
  const player = initCustomSearchStore()

  return (
    <CustomSearchContext.Provider value={player}>
      {children}
    </CustomSearchContext.Provider>
  )
}
