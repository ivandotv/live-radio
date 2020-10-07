import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { ListStations, RadioStation } from './ListStations'
import { TagList } from './TagList'
import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'

export const ListStationsWrap = observer(function ListStationsWrap({
  term,
  breadcrumbs
}: {
  term: string
  breadcrumbs: { href?: string; text: string }[]
}) {
  const player = useMusicPlayerStore()

  const listRow = (
    station: RadioStation,
    query: string,
    sendQuery: (query: string, delay: number) => void
  ) => {
    return (
      <>
        <div>
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
        </div>
        <TagList
          tags={station.tags}
          onTagClick={(tag) => {
            console.log(`query ${query} tag ${tag}`)
            sendQuery(query.length ? `${query} ${tag}` : `${tag}`, 0)
          }}
        />
      </>
    )
  }

  return (
    <ListStations
      title={`Browse For Stations in ${term}`}
      breadcrumbs={breadcrumbs}
      itemRow={listRow}
      noData={
        <p>
          Currently there is no data for <strong>${term}</strong>. Sorry for the
          inconvenience.
        </p>
      }
    ></ListStations>
  )
})
