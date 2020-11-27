import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from 'components/BrowseBy'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { PageTitle } from 'components/PageTitle'
import { stationDataRow, stationsToRadioStations } from 'lib/stationUtils'
import { RadioStation } from 'types'
import { userAgentName } from 'lib/appSettings'

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    // todo - add most popular genres
    paths: [{ params: { genre: 'pop' } }],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  console.log('genre get static props', ctx)

  const genre = (ctx.params?.genre as string).replace(/-/g, ' ')

  const api = new RadioBrowserApi(fetch, userAgentName)
  const stations = await api.searchStations(
    {
      tag: genre,
      limit: 1500,
      hideBroken: true
    },
    undefined,
    true
  )

  return {
    props: {
      stations: stationsToRadioStations(stations),
      genre
    },
    revalidate: 600 // 10 minutes
  }
}

export default function GenreStations({
  genre,
  stations
}: {
  stations: RadioStation[]
  genre: string
}) {
  const breadcrumbs = [
    {
      href: '/app/search',
      text: 'Search'
    },
    {
      href: '/app/search/by-genre',
      text: 'By Genre'
    },
    {
      text: `${genre}`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['tags', 'name', 'country', 'continent']}
    >
      <PageTitle title={`Search For Stations in ${genre}`} />
      <BrowseBy
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow()}
        filterInputText="Filter stations"
        noData={
          <p>
            Currently there is no data for <strong>${genre}</strong>. Sorry for
            the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
