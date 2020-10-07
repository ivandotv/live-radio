import Button from '@material-ui/core/Button'
import { observer } from 'mobx-react-lite'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'
import { ListStations, RadioStation } from './ListStations'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'
import { TagList } from './TagList'

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
              console.log(station.url)
              if (player.stationUUID === station.uuid) {
                // this station is already selected
                if (player.status === PlayerStatus.PLAYING) {
                  player.pause()
                  // check if its playing our station
                } else if (player.status === PlayerStatus.STOPPED) {
                  player.play(station)
                } else if (player.status === PlayerStatus.PAUSED) {
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
