import { AppDefaultLayout } from '../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../components/app/sidebars/AppMenuItem'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'

export default function Browse() {
  return (
    <Paper>
      <List>
        <AppMenuItem link={{ href: '/app/browse' }} primary="Local Radio" />
        <AppMenuItem
          link={{ href: '/app/browse/by-location' }}
          primary="By Location"
        />
        <AppMenuItem link={{ href: '/app/browse' }} primary="By Language" />
        <AppMenuItem link={{ href: '/app/browse' }} primary="By Genre" />
        <AppMenuItem link={{ href: '/app/browse' }} primary="Custom Search" />
      </List>
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
