import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { ListStations, RadioStation } from './ListStations'
import { TagList } from './TagList'
import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'

export const ListStationsWrap = observer(function ListStationsWrap({
  term,
  breadcrumbs
}: {
  term: string
  breadcrumbs: { href?: string; text: string }[]
}) {
  const player = useMusicPlayerStore()

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
      primary={(station: RadioStation) => {
        return (
          // todo this should be toggle play button
          <Button
            onClick={() => {
              if (player.stationUUID === station.uuid) {
                // this station is already selected
                if (player.status === 'playing') {
                  player.pause()
                  // check if its playing our station
                } else if (player.status === 'stopped') {
                  player.play(station)
                } else if (player.status === 'paused') {
                  player.resume()
                }
              } else {
                //
                // console.error('invalid player state')
                player.play(station)
              }
              /// //
            }}
            startIcon={<PlayPauseBtn uuid={station.uuid} />}
          >
            {`${station.name} | ${station.country}`}
          </Button>
        )
      }}
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
})
