import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from '../../components/app/layout/AppDefaultLayout'
import { PageTitle } from '../../components/pageTitle'

export default function About() {
  return (
    <Paper>
      <PageTitle title="About Application" />
      about
    </Paper>
  )
}

About.layout = AppDefaultLayout
