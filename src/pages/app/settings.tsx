import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from '../../components/app/layout/AppDefaultLayout'
import { PageTitle } from '../../components/PageTitle'

export default function Settings() {
  return (
    <Paper>
      <PageTitle title="Application Settings" />
      settings
    </Paper>
  )
}

Settings.layout = AppDefaultLayout
