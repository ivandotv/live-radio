import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import Paper from '@material-ui/core/Paper'
import { PageTitle } from 'components/PageTitle'

export default function Browse() {
  return (
    <Paper>
      <PageTitle title=" Next Radio App" />
      <h1>App Root = ovde staviti recent i tako to</h1>
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
