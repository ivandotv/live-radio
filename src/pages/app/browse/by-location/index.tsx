import { useRouter } from 'next/router'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import { continentsByCode } from '../../../../lib/utils/continentsByode'
import { LocationBreadcrumbs } from '../../../../components/app/LocationBreadcrumbs'
import { PageTitle } from '../../../../components/PageTitle'

export default function ByLocation() {
  const continents = []

  for (const [key, value] of Object.entries(continentsByCode)) {
    continents.push(
      <li key={key}>
        <AppMenuItem
          link={{
            href: {
              pathname: '/app/browse/by-location/[continent]'
            },
            as: {
              pathname: `/app/browse/by-location/${key}`
            }
          }}
          primary={value}
        />
      </li>
    )
  }

  const breadcrumbs = [
    {
      href: '/app/browse',
      as: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-location',
      as: '/app/browse/by-location',
      text: 'By Location'
    }
  ]

  return (
    <Paper>
      <PageTitle title="Browse By Location" />
      <LocationBreadcrumbs links={breadcrumbs} />
      <List>{continents}</List>
    </Paper>
  )
}

ByLocation.layout = AppDefaultLayout
