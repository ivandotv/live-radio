import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationBreadcrumbs } from 'components/LocationBreadcrumbs'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { continentsByCode } from 'lib/utils'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'initTranslations'

export { getStaticTranslations as getStaticProps }

export default function ByLocation() {
  const continents = []

  for (const [key, value] of Object.entries(continentsByCode())) {
    continents.push(
      <li key={key}>
        <AppMenuItem
          link={{
            href: {
              pathname: '/app/search/by-location/[continent]'
            },
            as: {
              pathname: `/app/search/by-location/${key}`
            }
          }}
          primary={value.t}
        />
      </li>
    )
  }

  const breadcrumbs = [
    {
      href: '/app/search',
      text: t`Search`
    },
    {
      href: '/app/search/by-location',
      text: t`By Location`
    }
  ]

  return (
    <div style={{ overflowY: 'scroll' }}>
      <PageTitle title={t`Search By Location`} />
      <LocationBreadcrumbs links={breadcrumbs} />
      <List>{continents}</List>
    </div>
  )
}

ByLocation.layout = AppDefaultLayout
