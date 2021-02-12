import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { AppTheme } from 'lib/stores/app-shell-store'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect } from 'react'

// https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
export const ThemeQueryComponent = observer(function ThemeQueryComponent({
  themeKey,
  desktopDrawerKey
}: {
  themeKey: string
  desktopDrawerKey: string
}) {
  const { appShell } = useRootStore()
  // const isInitialMount = useRef(true)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  //  monitor for system / browser changes to the theme
  useLayoutEffect(
    () =>
      autorun(() => {
        const theme = window.localStorage.getItem(themeKey)

        if (typeof theme === 'string') {
          // we have explicitly set theme
          appShell.setTheme(theme as AppTheme)
        } else {
          // system or browser set theme
          appShell.setTheme(prefersDarkMode ? 'dark' : 'light', false)
        }
      }),
    [prefersDarkMode, themeKey, appShell]
  )

  // setup desktop drawer position
  useLayoutEffect(
    () =>
      autorun(() => {
        const isOpen = window.localStorage.getItem(desktopDrawerKey)
        appShell.setDesktopDrawer(isOpen === 'open', false)
        appShell.readyToShow(true)
      }),
    [appShell, desktopDrawerKey]
  )

  // write currently chosen theme to local storage
  useEffect(
    () =>
      reaction(
        () => appShell.theme,
        () => {
          if (appShell.persistTheme) {
            window.localStorage.setItem(themeKey, appShell.theme)
          }
        }
      ),
    [appShell, themeKey]
  )
  useEffect(
    () =>
      reaction(
        () => appShell.desktopDrawerIsOpen,
        () => {
          window.localStorage.setItem(
            desktopDrawerKey,
            appShell.desktopDrawerIsOpen ? 'open' : 'closed'
          )
        }
      ),
    [appShell.desktopDrawerIsOpen, desktopDrawerKey]
  )

  return null
})
