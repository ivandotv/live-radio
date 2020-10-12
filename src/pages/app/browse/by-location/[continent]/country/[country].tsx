import { countries, continents } from 'countries-list'
import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from '../../../../../../components/app/BrowseBy'
import { AppDefaultLayout } from '../../../../../../components/app/layout/AppDefaultLayout'
import { FilterStoreProvider } from '../../../../../../components/app/providers/StoreProvider'
import {
  stationDataRow,
  stationsToRadioStations
} from '../../../../../../lib/stationUtils'
import { RadioStation } from '../../../../../../types'
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

  const api = new RadioBrowserApi('radio-next', fetch)
  const stations = await api.searchStations({
    countryCode: countryCode.toUpperCase(),
    limit: 3000,
    hideBroken: true
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
  countryCode,
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
    <FilterStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['language', 'country', 'tags', 'continent', 'name']}
    >
      <BrowseBy
        filterInputText="Filter Stations"
        title={`Browse For Stations in ${countryName}`}
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow}
        noData={
          <p>
            Currently there is no data for <strong>${countryName}</strong>.
            Sorry for the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

CountryStations.layout = AppDefaultLayout
