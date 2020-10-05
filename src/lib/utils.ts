import { useEffect } from 'react'
import { useAppShell } from '../components/app/providers/AppShellProvider'
import countriesJSON from './../generated/countries.json'

// todo - remove
// export function useDesktopDrawerPosition(
//   context: typeof useAppShell,
//   key = 'desktopDrawerState'
// ) {
//   const { state, dispatch } = useAppShell()

//   useEffect(() => {
//     const isOpen = window.localStorage.getItem(key)

//     dispatch({
//       type: Actions.DESKTOP_DRAWER_IS_OPEN,
//       payload: isOpen ? isOpen === 'open' : true
//     })
//   }, [])

//   useEffect(() => {
//     window.localStorage.setItem(
//       key,
//       state.desktopDrawerIsOpen ? 'open' : 'closed'
//     )
//   }, [state.desktopDrawerIsOpen])
// }

export function countryDataByKey(
  key: 'code' | 'name' | 'flag',
  value: string
  // haystack: {
  //   [key: string]: { name: string; cont: string; code: string; flag: string }[]
  // }
) {
  console.log('countryDataByName needle ', value)

  for (const [_i, continent] of Object.entries(countriesJSON)) {
    for (const [_i, country] of Object.entries(continent)) {
      if (country[key].toLowerCase() === value.toLowerCase()) {
        return country
      }
    }
  }
}
