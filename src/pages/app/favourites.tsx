import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from '../../components/app/layout/AppDefaultLayout'
import { PageTitle } from '../../components/PageTitle'

export default function Favourites() {
  return (
    <Paper>
      <PageTitle title="Your Favourite Radio Stations" />
      favourites
    </Paper>
  )
}

Favourites.layout = AppDefaultLayout
