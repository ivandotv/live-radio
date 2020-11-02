import List from '@material-ui/core/List'
import { observer } from 'mobx-react-lite'
import { AppMenuItem } from 'components/sidebars/AppMenuItem'
import { NextRouter } from 'next/router'

export const Menu = observer(function Menu() {
  return (
    <List>
      <AppMenuItem
        link={{ href: '/app/browse' }}
        primary="Browse"
        selected={(router: NextRouter) =>
          router.asPath.indexOf('/app/browse') === 0
        }
      />
      <AppMenuItem
        link={{ href: '/app/favourites' }}
        selected={(router) => router.asPath.indexOf('/app/favourites') === 0}
        primary="Favourites"
      />
      <AppMenuItem
        link={{ href: '/app/recent-stations' }}
        selected={(router: NextRouter) =>
          router.asPath.indexOf('/app/recent-stations') === 0
        }
        primary="Recent Stations"
      />
      <AppMenuItem
        link={{ href: '/app/recent-songs' }}
        selected={(router: NextRouter) =>
          router.asPath.indexOf('/app/recent-songs') === 0
        }
        primary="Recent Songs"
      />
      <AppMenuItem
        link={{ href: '/app/settings' }}
        selected={(router: NextRouter) =>
          router.asPath.indexOf('/app/settings') === 0
        }
        primary="Settings"
      />
      <AppMenuItem
        link={{ href: '/app/about' }}
        selected={(router: NextRouter) =>
          router.asPath.indexOf('/app/about') === 0
        }
        primary="About"
      />
    </List>
  )
})
