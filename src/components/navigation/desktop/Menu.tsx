import { t } from '@lingui/macro'
import List from '@material-ui/core/List'
import { AppMenuItem } from 'components/navigation/desktop/MenuItem'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

export const Menu = observer(function Menu() {
  const router = useRouter()

  const menuItems = [
    {
      link: '/app',
      text: t`Search`,
      selected:
        router.asPath === '/app' ||
        router.asPath.startsWith('/app/by-') ||
        router.asPath.startsWith('/app/custom')
    },
    {
      link: '/app/favorites',
      text: t`Favorites`,
      selected: router.asPath.startsWith('/app/favorites')
    },
    {
      link: '/app/recent',
      text: t`Recent Stations`,
      selected: router.asPath.startsWith('/app/recent')
    },
    {
      link: '/app/settings',
      text: t`Settings`,
      selected: router.asPath.startsWith('/app/settings')
    },
    {
      link: '/app/about',
      text: t`About`,
      selected: router.asPath.startsWith('/app/about')
    }
  ]

  return (
    <List>
      {menuItems.map((item) => (
        <AppMenuItem
          key={item.link}
          link={{ href: `${item.link}` }}
          primary={item.text}
          selected={item.selected}
        />
      ))}
    </List>
  )
})
