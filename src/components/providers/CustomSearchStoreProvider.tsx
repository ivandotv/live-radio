import { radioAPIUserAgent } from 'lib/shared/config'
import { RadioBrowserApi } from 'radio-browser-api'
import {
  customSearchFactory,
  CustomSearchStore
} from 'lib/client/stores/custom-search-store'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'

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
  const store = customSearchFactory(new RadioBrowserApi(radioAPIUserAgent))

  return (
    <CustomSearchContext.Provider value={store}>
      {children}
    </CustomSearchContext.Provider>
  )
}
