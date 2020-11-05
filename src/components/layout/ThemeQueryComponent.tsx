import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useAppShell } from 'components/providers/RootStoreProvider'
import { AppTheme } from 'lib/stores/AppShellStore'
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
  const store = useAppShell()
  // const isInitialMount = useRef(true)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  //  monitor for system / browser changes to the theme
  useLayoutEffect(
    () =>
      autorun(() => {
        const theme = window.localStorage.getItem(themeKey)

        if (typeof theme === 'string') {
          // we have explicitly set theme
          store.setTheme(theme as AppTheme)
        } else {
          // system or browser set theme
          store.setTheme(prefersDarkMode ? 'dark' : 'light', false)
        }
      }),
    [prefersDarkMode, themeKey, store]
  )

  // setup desktop drawer position
  useLayoutEffect(
    () =>
      autorun(() => {
        const isOpen = window.localStorage.getItem(desktopDrawerKey)
        store.setDesktopDrawer(isOpen === 'open', false)
        store.readyToShow(true)
      }),
    [store, desktopDrawerKey]
  )

  // write currently chosen theme to local storage
  useEffect(
    () =>
      reaction(
        () => store.theme,
        () => {
          if (store.persistTheme) {
            window.localStorage.setItem(themeKey, store.theme)
          }
        }
      ),
    [store, themeKey]
  )
  useEffect(
    () =>
      reaction(
        () => store.desktopDrawerIsOpen,
        () => {
          window.localStorage.setItem(
            desktopDrawerKey,
            store.desktopDrawerIsOpen ? 'open' : 'closed'
          )
        }
      ),
    [store.desktopDrawerIsOpen, desktopDrawerKey]
  )

  return null
})
