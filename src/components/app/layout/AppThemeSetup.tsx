import { ThemeProvider } from '@material-ui/core/styles'
import { observer, Observer } from 'mobx-react-lite'
import { ReactNode, useEffect, useState } from 'react'
import { DarkTheme, LightTheme } from '../../../lib/theme'
import { ThemeQueryComponent } from './ThemeQueryComponent'
import { useRootStore } from '../providers/RootStoreProvider'

// enableStaticRendering(typeof window === 'undefined')

// let store: AppShellStore

// const AppShellContext = createContext<AppShellStore | undefined>(undefined)

// export function useAppShell() {
//   const context = useContext(AppShellContext)
//   if (context === undefined) {
//     throw new Error('useAppShell must be used within AppShellProvider')
//   }

//   return context
// }

export const AppThemeSetup = observer(function AppLayoutSetup({
  children
}: {
  children: ReactNode
}) {
  const { appShell } = useRootStore()

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

  return (
    <Observer>
      {() => {
        return (
          <ThemeProvider
            theme={appShell.theme === 'dark' ? DarkTheme : LightTheme}
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
  )
})
