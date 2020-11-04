import { useRouter } from 'next/router'
import { BrowseBy } from 'components/BrowseBy'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import countriesJSON from 'generated/countries.json'
import { continentsByCode } from 'lib/utils'
import { PageTitle } from 'components/PageTitle'

// list countries for the continent
export default function CountryList() {
  const router = useRouter()

  const continent = router.query.continent as keyof typeof countriesJSON
  const countryDataRow = function (
    countries: { name: string; code: string; flag: string; cont: string }[]
  ) {
    return function CountryRow(index: number) {
      const country = countries[index]

      return (
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/country/[country]`
            },
            as: {
              pathname: `${router.pathname.replace(
                '[continent]',
                continent
              )}/country/${country.code}`
            }
          }}
          primary={`${country.name} ${country.flag}`}
        />
      )
    }
  }

  const breadcrumbs = [
    {
      href: '/app/search',
      text: 'Search'
    },
    {
      href: '/app/search/by-location',
      text: 'By Location'
    },
    {
      text: `${continentsByCode[continent]}`
    }
  ]

  const showFallback = () => {
    return !continent
  }

  return (
    <FilterDataStoreProvider
      initialState={countriesJSON[continent]}
      uuid="name"
      indexes={['name']}
    >
      <PageTitle title="Search for stations by country" />
      <BrowseBy
        filterInputText="Filter Countries"
        breadcrumbs={breadcrumbs}
        dataRow={countryDataRow}
        showFallback={showFallback}
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

CountryList.layout = AppDefaultLayout
