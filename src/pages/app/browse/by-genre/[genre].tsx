import { GetStaticPaths, GetStaticProps } from 'next'
import { observer } from 'mobx-react-lite'
import { RadioBrowserApi } from 'radio-browser-api'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import {
  ListStations,
  RadioStation
} from '../../../../components/app/ListStations'
import { TagList } from '../../../../components/app/TagList'
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
      language: station.language.split(',')
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

// todo - test wrap in observer
export default function GenreStationsWrap(props: any) {
  return <GenreStations {...props} />
}

const GenreStations = observer(function GenreStations({
  stations,
  genre
}: {
  stations: RadioStation[]
  genre: string
}) {
  const breadcrumbLinks = [
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
  console.log('genre')

  return (
    <FilterStoreProvider initialState={stations}>
      <ListStations
        title={`Browse For Stations in ${genre}`}
        breadcrumbs={breadcrumbLinks}
        noData={
          <p>
            Currently there is no data for <strong>${genre}</strong>. Sorry for
            the inconvenience.
          </p>
        }
        primary={(station: RadioStation) =>
          `${station.name} | ${station.country}`
        }
        secondary={(
          station: RadioStation,
          query: string,
          sendQuery: (query: string, delay: number) => void
        ) => (
          <TagList
            tags={station.tags}
            onTagClick={(tag) => {
              console.log(`query ${query} tag ${tag}`)
              sendQuery(query.length ? `${query} ${tag}` : `${tag}`, 0)
            }}
          />
        )}
        stations={stations}
      ></ListStations>
    </FilterStoreProvider>
  )
})

GenreStationsWrap.layout = AppDefaultLayout
