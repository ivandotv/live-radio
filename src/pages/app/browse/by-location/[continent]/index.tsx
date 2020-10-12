import { useRouter } from 'next/router'
import { BrowseBy } from '../../../../../components/app/BrowseBy'
import { AppDefaultLayout } from '../../../../../components/app/layout/AppDefaultLayout'
import { FilterStoreProvider } from '../../../../../components/app/providers/StoreProvider'
import { AppMenuItem } from '../../../../../components/app/sidebars/AppMenuItem'
import countriesJSON from '../../../../../generated/countries.json'
import { continentsByCode } from '../../../../../lib/utils/continentsByode'

// list countries for the continent
export default function CountryList() {
  // list continents

  const router = useRouter()

  console.log('continent router ', router)

  const continent = router.query.continent as keyof typeof countriesJSON

  // const continentCode = continent
  // const countrySearch = countriesJSON[continent].map((country) => {
  //   return {
  //     name: country.name
  //   }
  // })

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

  const showFallback = () => {
    return !continent
  }

  console.log('show fallback ', showFallback())
  console.log('router query ', router.query.continent)

  return (
    <FilterStoreProvider
      initialState={countriesJSON[continent]}
      uuid="name"
      indexes={['name']}
    >
      <BrowseBy
        filterInputText="Filter Countries"
        title="Browse For Stations by Country"
        breadcrumbs={breadcrumbs}
        dataRow={countryDataRow}
        showFallback={showFallback}
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

CountryList.layout = AppDefaultLayout
