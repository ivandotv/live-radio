import { countries, continents } from 'countries-list'
import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from 'components/BrowseBy'

import { PageTitle } from 'components/PageTitle'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'

import { stationDataRow, stationsToRadioStations } from 'lib/stationUtils'
import { RadioStation } from 'types'
// @ts-ignore
import getFlag from 'country-code-emoji'

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    // todo - add major countries
    paths: [{ params: { country: 'RS', continent: 'EU' } }],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const countryCode = (ctx.params?.country as string).replace(/-/g, ' ')
  const continent = (ctx.params?.continent as string).replace(/-/g, ' ')
  const country = countries[countryCode as keyof typeof countries]
  const flag = getFlag(countryCode)

  const api = new RadioBrowserApi(fetch)
  const stations = await api.searchStations({
    countryCode: countryCode.toUpperCase(),
    limit: 3000
  })

  const radioStations = stationsToRadioStations(stations)

  return {
    props: {
      stations: radioStations,
      countryName: country.name,
      countryCode,
      continentName: continents[country.continent as keyof typeof continents],
      continentCode: continent,
      flag
    },
    revalidate: 600 // 10 minutes
  }
}

export default function CountryStations({
  stations,
  countryName,
  continentName,
  continentCode,
  flag
}: {
  stations: RadioStation[]
  countryName: string
  countryCode: string
  continentName: string
  continentCode: string
  flag: string
}) {
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
      href: '/app/browse/by-location/[continent]',
      as: `/app/browse/by-location/${continentCode}`,
      text: `${continentName}`
    },
    {
      text: `${countryName} ${flag} `
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['language', 'country', 'tags', 'continent', 'name']}
    >
      <PageTitle title={`Browse For Stations in ${countryName}`} />
      <BrowseBy
        filterInputText="Filter Stations"
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow(false, false)}
        noData={
          <p>
            Currently there is no data for <strong>${countryName}</strong>.
            Sorry for the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

CountryStations.layout = AppDefaultLayout
