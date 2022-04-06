import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from 'components/layout'
import { PageTitle } from 'components/PageTitle'

export default function About() {
  return (
    <Paper>
      <PageTitle title="About Application" />
      about
    </Paper>
  )
}

About.layout = AppDefaultLayout
