import { locationFactory } from 'lib/stores/factories/location-factory'
import { LocationStore } from 'lib/stores/location-store'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'

enableStaticRendering(typeof window === 'undefined')

const LocationStoreContext = createContext<LocationStore | undefined>(undefined)
LocationStoreContext.displayName = 'LocationStoreContext'

export function useLocationStore() {
  const context = useContext(LocationStoreContext)
  if (typeof context === 'undefined') {
    throw new Error('LocactionStore must be used within LocationProvider')
  }

  return context
}

export function LocationStoreProvider({ children }: { children: ReactNode }) {
  return (
    <LocationStoreContext.Provider value={locationFactory()}>
      {children}
    </LocationStoreContext.Provider>
  )
}
