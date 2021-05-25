import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationBreadcrumbs } from 'components/LocationBreadcrumbs'
import { AppMenuItem } from 'components/navigation/desktop/MenuItem'
import { PageTitle } from 'components/PageTitle'
import { continentsByCode } from 'lib/utils'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'lib/translations'

export { getStaticTranslations as getStaticProps }

export default function ByLocation() {
  const continents = []

  for (const [key, value] of Object.entries(continentsByCode())) {
    continents.push(
      <li key={key}>
        <AppMenuItem
          link={{
            href: {
              pathname: '/app/by-location/[continent]'
            },
            as: {
              pathname: `/app/by-location/${key}`
            }
          }}
          primary={value.t}
        />
      </li>
    )
  }

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-location',
      text: t`By Location`
    }
  ]

  return (
    <div style={{ overflowY: 'auto' }}>
      <PageTitle title={t`Search By Location`} />
      <LocationBreadcrumbs links={breadcrumbs} />
      <List>{continents}</List>
    </div>
  )
}

ByLocation.layout = AppDefaultLayout
