import Paper from '@material-ui/core/Paper'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { getStaticTranslations } from 'initTranslations'
import { t } from '@lingui/macro'

export { getStaticTranslations as getStaticProps }

export default function Settings() {
  return (
    <Paper>
      <PageTitle title={t`Application Settings`} />
      settings
    </Paper>
  )
}

Settings.layout = AppDefaultLayout
