import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from '../../components/app/layout/AppDefaultLayout'
import { PageTitle } from '../../components/pageTitle'

export default function RecentStations() {
  return (
    <Paper>
      <PageTitle title="Recently Listened Stations" />
      recent
    </Paper>
  )
}

RecentStations.layout = AppDefaultLayout
