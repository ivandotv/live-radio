import { locationStoreFactory } from 'lib/stores/initializers/locationStoreFactory'
import { LocationStore } from 'lib/stores/LocationStore'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'

enableStaticRendering(typeof window === 'undefined')

const ctx = createContext<LocationStore | undefined>(undefined)

export function useLocationStore() {
  const context = useContext(ctx)
  if (typeof context === 'undefined') {
    throw new Error('LocactionStore must be used within LocationProvider')
  }

  return context
}

export function LocationStoreProvider({ children }: { children: ReactNode }) {
  return <ctx.Provider value={locationStoreFactory()}>{children}</ctx.Provider>
}
