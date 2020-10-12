import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from '../../../../components/app/BrowseBy'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { FilterStoreProvider } from '../../../../components/app/providers/StoreProvider'
import { StationRowItem } from '../../../../components/app/StationRowItem'
import { RadioStation } from '../../../../types'

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

  const api = new RadioBrowserApi('radio-next', fetch, true)
  const stations = await api.searchStations({
    tag: genre,
    limit: 1500,
    hideBroken: true
  })

  const leanStations = []
  // strip properties that are not in use
  for (const station of stations) {
    leanStations.push({
      tags: [...new Set(station.tags.split(','))],
      name: station.name,
      url: station.url_resolved,
      uuid: station.stationuuid,
      favicon: station.favicon,
      homepage: station.homepage,
      country: station.country,
      language: station.language.split(','),
      codec: station.codec
    })
  }

  return {
    props: {
      stations: leanStations,
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
  // const classes = useStyles()
  console.log('GENRE STATIONS')
  const breadcrumbs = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-genre',
      text: 'By Genre'
    },
    {
      text: `${genre}`
    }
  ]

  const row = function (stations: RadioStation[]) {
    return function DataRow(index: number) {
      const station = stations[index]

      return <StationRowItem station={station}></StationRowItem>
    }
  }

  return (
    <FilterStoreProvider
      initialState={stations}
      uuid="uuid"
      indexes={['tags', 'name']}
    >
      <BrowseBy
        title={`Browse For Stations in ${genre}`}
        breadcrumbs={breadcrumbs}
        dataRow={row}
        filterInputText="Filter stations"
        noData={
          <p>
            Currently there is no data for <strong>${genre}</strong>. Sorry for
            the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
