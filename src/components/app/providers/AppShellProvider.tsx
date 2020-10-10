import { enableStaticRendering, Observer } from 'mobx-react-lite'
import { AppShellStore } from '../../../lib/stores/AppShellStore'
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext
} from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { ThemeQueryComponent } from './../layout/ThemeQueryComponent'
import { DarkTheme, LightTheme } from './../../../lib/theme'

enableStaticRendering(typeof window === 'undefined')

let store: AppShellStore

const AppShellContext = createContext<AppShellStore | undefined>(undefined)

export function useAppShell() {
  const context = useContext(AppShellContext)
  if (context === undefined) {
    throw new Error('useAppShell must be used within AppShellProvider')
  }

  return context
}

export function AppShellProvider({ children }: { children: ReactNode }) {
  const store = initMyStore()

  // leave if out of mobx because of suspense
  const [showQueryTheme, setShowQueryTheme] = useState(false)

  // console.log('new app shell provider')
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
    setShowQueryTheme(true)
  }, [])

  // const key = 'desktopDrawerState'
  // useEffect(() => {
  //   const isOpen = window.localStorage.getItem(key)

  //   // dispatch({
  //   //   type: Actions.DESKTOP_DRAWER_IS_OPEN,
  //   //   payload: isOpen ? isOpen === 'open' : true
  //   // })
  //   store.setDesktopDrawer(isOpen ? isOpen === 'open' : true)
  // }, [store])

  // useEffect(() => {
  //   window.localStorage.setItem(
  //     key,
  //     store.desktopDrawerIsOpen ? 'open' : 'closed'
  //   )
  // }, [store.desktopDrawerIsOpen])

  return (
    <AppShellContext.Provider value={store}>
      <Observer>
        {() => {
          // console.log('Observer component , ', store.theme)

          return (
            <ThemeProvider
              theme={store.theme === 'dark' ? DarkTheme : LightTheme}
            >
              {showQueryTheme ? (
                <ThemeQueryComponent
                  themeKey="theme"
                  desktopDrawerKey="desktopDrawerState"
                />
              ) : null}
              {children}
            </ThemeProvider>
          )
        }}
      </Observer>
    </AppShellContext.Provider>
  )
}

function initMyStore() {
  const _store = store ?? new AppShellStore()

  // console.log('init store')
  // console.log('browser ', typeof window !== 'undefined')
  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  //   if (initialState) {
  //     _store.hydrate(initialState)
  //   }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}
