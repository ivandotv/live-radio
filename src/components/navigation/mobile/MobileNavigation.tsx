import { t } from '@lingui/macro'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FavoriteIcon from '@material-ui/icons/Favorite'
import RestoreIcon from '@material-ui/icons/Restore'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

function getSelected(path: string, paths: string[]) {
  //get for first item in menuPaths
  if (
    path === '/app' ||
    path.startsWith('/app/by-') ||
    path.startsWith('/app/custom')
  ) {
    return 0
  }

  //skip first item
  for (let i = 1; i < paths.length; i++) {
    if (path.startsWith(paths[i])) {
      return i
    }
  }

  return -1
}

export const MobileNavigation = observer(function MobileNavigation() {
  const classes = useStyles()
  const router = useRouter()
  const [selected, setSelected] = useState(-1)

  useEffect(() => {
    const currSelected = getSelected(router.asPath, menuPaths)
    console.log('curr selected ', currSelected)
    if (currSelected !== -1) {
      setSelected(currSelected)
    }
  }, [router.asPath])

  return (
    <BottomNavigation
      value={selected}
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
