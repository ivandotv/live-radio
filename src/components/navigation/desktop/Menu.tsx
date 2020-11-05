import List from '@material-ui/core/List'
import { observer } from 'mobx-react-lite'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { NextRouter } from 'next/router'

const menuItems = [
  {
    link: '/app/search',
    text: 'Search'
  },
  {
    link: '/app/favourites',
    text: 'Favourites'
  },
  {
    link: '/app-recent-stations',
    text: 'Recent Stations'
  },
  {
    link: '/app-settings',
    text: 'Settings'
  },
  {
    link: '/app/about',
    text: 'About'
  }
]

function isSelected(path: string) {
  return (router: NextRouter) => {
    return router.asPath.indexOf(path) === 0
  }
}
export const Menu = observer(function Menu() {
  return (
    <List>
      {menuItems.map((item) => (
        <AppMenuItem
          key={item.link}
          link={{ href: `${item.link}` }}
          primary={item.text}
          selected={isSelected(`${item.link}`)}
        />
      ))}
    </List>
  )
})
