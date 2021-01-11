import BottomNavigation from '@material-ui/core/BottomNavigation'
import { t } from '@lingui/macro'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FavoriteIcon from '@material-ui/icons/Favorite'
import RestoreIcon from '@material-ui/icons/Restore'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import { observer } from 'mobx-react-lite'
import { NextRouter, useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
// import

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      '&$selected, &$selected:hover': {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.selected
      }
    },
    selected: {}
  })
)

const menuPaths = [
  '/app',
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
      // className={classes.root}
    >
      <BottomNavigationAction
        classes={{ ...classes }}
        label={t`Search`}
        icon={<SearchIcon />}
      />
      <BottomNavigationAction
        classes={{ ...classes }}
        label={t`Favorites`}
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        classes={{ ...classes }}
        label={t`Recent`}
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        classes={{ ...classes }}
        label={t`Settings`}
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  )
})
