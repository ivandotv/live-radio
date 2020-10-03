import { useAppShell } from '../providers/AppShellProvider'
import { useRef, useEffect, useLayoutEffect } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { AppTheme } from '../../../lib/stores/AppShellStore'

// https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
export function ThemeQueryComponent() {
  const store = useAppShell()
  const storageKey = 'theme'
  const isInitialMount = useRef(true)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // write currently chosen theme to local storage
  useEffect(() => {
    // do not run on mount
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.localStorage.setItem(storageKey, store.theme)
    }
  }, [store.theme])

  //  monitor for system / browser changes to the theme
  // todo - split in to two effects
  useLayoutEffect(() => {
    const theme = window.localStorage.getItem(storageKey)

    if (typeof theme === 'string') {
      // we have explicitly set theme
      store.setTheme(theme as AppTheme)
    } else {
      // system or browser set theme
      // dispatch({
      //   type: Actions.SET_THEME,
      //   payload: prefersDarkMode ? 'dark' : 'light'
      // })
      store.setTheme(prefersDarkMode ? 'dark' : 'light')
    }
    // setShowApp(true)
    // dispatch({ type: Actions.READY_TO_SHOW, payload: true })
    console.log('theme query effect')
    store.readyToShow(true)
  }, [prefersDarkMode, store])

  return null
}
