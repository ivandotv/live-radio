import { ListStations, RadioStation } from './ListStations'
import { TagList } from './TagList'

export function ListStationsWrap({
  term,
  breadcrumbs
}: {
  term: string
  breadcrumbs: { href?: string; text: string }[]
}) {
  return (
    <ListStations
      title={`Browse For Stations in ${term}`}
      breadcrumbs={breadcrumbs}
      noData={
        <p>
          Currently there is no data for <strong>${term}</strong>. Sorry for the
          inconvenience.
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
    ></ListStations>
  )
}
