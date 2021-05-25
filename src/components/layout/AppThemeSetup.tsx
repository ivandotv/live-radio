import { ThemeProvider } from '@material-ui/core/styles'
import { observer, Observer } from 'mobx-react-lite'
import { ReactNode, useEffect, useState } from 'react'
import { DarkTheme, LightTheme } from 'lib/theme'
import { ThemeQueryComponent } from './ThemeQueryComponent'
import { useRootStore } from 'components/providers/RootStoreProvider'

export const AppThemeProvider = observer(function AppThemeProvider({
  children
}: {
  children: ReactNode
}) {
  const { appShell } = useRootStore()

  // leave it out of mobx because of suspense
  const [showQueryTheme, setShowQueryTheme] = useState(false)

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
