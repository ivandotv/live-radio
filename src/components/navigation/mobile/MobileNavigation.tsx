import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { makeStyles } from '@material-ui/core/styles'
import FavoriteIcon from '@material-ui/icons/Favorite'
import RestoreIcon from '@material-ui/icons/Restore'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import { observer } from 'mobx-react-lite'
import { NextRouter, useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const useStyles = makeStyles({
  root: {}
})

const menuPaths = [
  '/app/search',
  '/app/favorites',
  '/app/recent-stations',
  '/app/settings'
]

function getSelected(router: NextRouter) {
  return menuPaths.findIndex((path) => router.asPath.indexOf(path) === 0)
}

export const MobileNavigation = observer(function MobileNavigation() {
  const classes = useStyles()
  const router = useRouter()
  const [value, setSelected] = useState(-1)

  useEffect(() => {
    const currSelected = getSelected(router)
    if (currSelected !== -1) {
      setSelected(currSelected)
    }
  }, [router])

  return (
    <BottomNavigation
      value={value}
      onChange={(_event, newValue) => {
        //navigate
        setSelected(newValue)
        router.push(menuPaths[newValue])
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Search" icon={<SearchIcon />} />
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Recent" icon={<RestoreIcon />} />
      <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
    </BottomNavigation>
  )
})
