import List from '@material-ui/core/List'
import { observer } from 'mobx-react-lite'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { NextRouter } from 'next/router'

function isSelected(path: string) {
  return (router: NextRouter) => {
    return router.asPath.indexOf(path) === 0
  }
}
export const Menu = observer(function Menu() {
  return (
    <List>
      <AppMenuItem
        link={{ href: '/app/search' }}
        primary="Browse"
        selected={isSelected('/app/search')}
      />
      <AppMenuItem
        link={{ href: '/app/favourites' }}
        selected={isSelected('/app/favourites')}
        primary="Favourites"
      />
      <AppMenuItem
        link={{ href: '/app/recent-stations' }}
        selected={isSelected('/app/recent-station')}
        primary="Recent Stations"
      />
      <AppMenuItem
        link={{ href: '/app/settings' }}
        selected={isSelected('/app/settings')}
        primary="Settings"
      />
      <AppMenuItem
        link={{ href: '/app/about' }}
        selected={isSelected('/app/about')}
        primary="About"
      />
    </List>
  )
})
