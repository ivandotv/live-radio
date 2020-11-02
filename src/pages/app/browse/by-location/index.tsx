import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationBreadcrumbs } from 'components/LocationBreadcrumbs'
import { AppMenuItem } from 'components/sidebars/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { continentsByCode } from 'lib/utils'

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
    <>
      <PageTitle title="Browse By Location" />
      <LocationBreadcrumbs links={breadcrumbs} />
      <List>{continents}</List>
    </>
  )
}

ByLocation.layout = AppDefaultLayout
