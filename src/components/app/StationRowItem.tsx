import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { RadioStation } from '../../types'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'
import { useFilterDataStore } from './providers/StoreProvider'
import { TagList } from './TagList'

export const StationRowItem = observer(function StationRowItem({
  station
}: {
  station: RadioStation
}) {
  const player = useMusicPlayerStore()
  const store = useFilterDataStore()

  const sendQuery = (query: string, delay?: number) => {
    store.search(query, delay)
  }
  // const station = store.filtered[index]
  if (__DEV__) {
    if (!station) {
      debugger
    }
  }

  return (
    <ListItem component="div">
      <ListItemText>
        <Button
          onClick={() => {
            console.log(station.url)
            console.log(station.id)
            console.log('-----')
            // todo - wrap in playerStore.togglePlay
            if (player.stationID === station.id) {
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
              player.play(station)
            }
          }}
          startIcon={<PlayPauseBtn uuid={station.id} />}
        >
          {`${station.name} | ${station.country} ${station.flag}`}
        </Button>
        <br />
        {/* <p>{index}</p> */}
        <p>{station.url}</p>
        <h6>{station.id}</h6>
        <TagList
          tags={station.tags}
          onTagClick={(tag) => {
            sendQuery(
              store.query.length ? `${store.query} ${tag}` : `${tag}`,
              0
            )
          }}
        />
      </ListItemText>
    </ListItem>
  )
})
