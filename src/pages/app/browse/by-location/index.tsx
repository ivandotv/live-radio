import { useRouter } from 'next/router'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import { continentsByCode } from '../../../../utils/continentsByode'
import { LocationBreadCrumbs } from '../../../../components/app/locationBreadCrumbs'
import { PageTitle } from '../../../../components/pageTitle'

export default function ByLocation() {
  const continents = []
  const router = useRouter()

  for (const [key, value] of Object.entries(continentsByCode)) {
    continents.push(
      <li key={key}>
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[continent]`,
              query: { name: 'test' }
            },
            as: {
              pathname: `${router.pathname}/${key}`,
              query: { name: 'test' }
            }
          }}
          primary={value}
        />
      </li>
    )
  }

  const breadcrumbLinks = [
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
      <LocationBreadCrumbs links={breadcrumbLinks} />
      <List>{continents}</List>
    </Paper>
  )
}

ByLocation.layout = AppDefaultLayout
