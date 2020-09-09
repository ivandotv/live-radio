import List from '@material-ui/core/List'
import { AppMenuItem } from './AppMenuItem'
import { useAppShell, Actions } from '../AppShellProvider'

export function Menu({ position }: { position: 'desktop' | 'mobile' }) {
  const { dispatch } = useAppShell()

  const closeDrawer = () => {
    dispatch({ type: Actions.MOBILE_DRAWER_IS_OPEN, payload: false })
  }

  const handleClick = position === 'mobile' ? () => closeDrawer() : undefined

  return (
    <List>
      <AppMenuItem
        link={{ href: '/app/browse' }}
        onClick={handleClick}
        primary="Browse"
        selected={(router) => router.asPath.indexOf('/app/browse') === 0}
      />
      <AppMenuItem
        link={{ href: '/app/favourites' }}
        onClick={handleClick}
        selected={(router) => router.asPath.indexOf('/app/favourites') === 0}
        primary="Favourites"
      />
      <AppMenuItem
        link={{ href: '/app/recent-stations' }}
        onClick={handleClick}
        selected={(router) =>
          router.asPath.indexOf('/app/recent-stations') === 0
        }
        primary="Recent Stations"
      />
      <AppMenuItem
        link={{ href: '/app/recent-songs' }}
        onClick={handleClick}
        selected={(router) => router.asPath.indexOf('/app/recent-songs') === 0}
        primary="Recent Songs"
      />
      <AppMenuItem
        link={{ href: '/app/settings' }}
        onClick={handleClick}
        selected={(router) => router.asPath.indexOf('/app/settings') === 0}
        primary="Settings"
      />
      <AppMenuItem
        link={{ href: '/app/about' }}
        onClick={handleClick}
        selected={(router) => router.asPath.indexOf('/app/about') === 0}
        primary="About"
      />
    </List>
  )
}
