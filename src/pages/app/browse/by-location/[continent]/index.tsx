import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import { useRouter } from 'next/router'
import { AppDefaultLayout } from '../../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../../components/app/sidebars/AppMenuItem'
import countriesJSON from '../../../../../generated/countries.json'
import { LocationbreadCrumbs } from '../../../../../components/app/LocationBreadcrumbs'
import { continentsByCode } from '../../../../../lib/utils/continentsByode'
import { PageTitle } from '../../../../../components/PageTitle'
export default function CountryList() {
  // list continents

  const router = useRouter()

  console.log('continent router ', router)
  if (!router.query.continent) {
    return null
  }
  const continent = router.query.continent as keyof typeof countriesJSON

  // const continentCode = continent
  const countries = []

  for (const country of countriesJSON[continent]) {
    countries.push(
      <li key={country.code}>
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/country/[country]`
            },
            as: {
              pathname: `${router.pathname.replace(
                '[continent]',
                router.query.continent as string
              )}/country/${country.code}`
            }
          }}
          primary={`${country.flag} ${country.name}`}
        />
      </li>
    )
  }

  const breadcrumbLinks = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-location',
      text: 'By Location'
    },
    {
      text: `${continentsByCode[continent]}`
    }
  ]

  return (
    <Paper>
      <PageTitle
        title={`Browse For Stations in ${continentsByCode[continent]}`}
      />
      <LocationbreadCrumbs links={breadcrumbLinks} />
      <List>{countries}</List>
    </Paper>
  )
}

CountryList.layout = AppDefaultLayout
