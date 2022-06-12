import { getClientContainer } from 'lib/client/injection-root'
import { CustomSearchStore } from 'lib/client/stores/custom-search-store'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo } from 'react'

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
  const store = useMemo(
    () => getClientContainer().resolve<CustomSearchStore>(CustomSearchStore),
    []
  )

  return (
    <CustomSearchContext.Provider value={store}>
      {children}
    </CustomSearchContext.Provider>
  )
}
