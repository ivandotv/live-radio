import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import {
  ListStations,
  RadioStation
} from '../../../../components/app/ListStations'
import { ListStationsWrap } from '../../../../components/app/ListStationsWrap'
import { FilterStoreProvider } from '../../../../components/app/providers/StoreProvider'

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

  const api = new RadioBrowserApi('radio-next', fetch)
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

  return (
    <FilterStoreProvider
      initialState={stations}
      uuid="uuid"
      indexes={['tags', 'name']}
    >
      {/* todo - pullout no data im to special component */}
      <ListStations
        title={`Browse For Stations in ${genre}`}
        breadcrumbs={breadcrumbs}
        noData={
          <p>
            Currently there is no data for <strong>${genre}</strong>. Sorry for
            the inconvenience.
          </p>
        }
      />
    </FilterStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
