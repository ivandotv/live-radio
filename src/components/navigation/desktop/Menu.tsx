import { t } from '@lingui/macro'
import List from '@material-ui/core/List'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { observer } from 'mobx-react-lite'
import { NextRouter } from 'next/router'

function isSelected(path: string) {
  return (router: NextRouter) => {
    return router.asPath.indexOf(path) === 0
  }
}
export const Menu = observer(function Menu() {
  const menuItems = [
    {
      link: '/app/search',
      text: t`Search`
    },
    {
      link: '/app/favorites',
      text: t`Favorites`
    },
    {
      link: '/app/recent-stations',
      text: t`Recent Stations`
    },
    {
      link: '/app/settings',
      text: t`Settings`
    },
    {
      link: '/app/about',
      text: t`About`
    }
  ]

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
