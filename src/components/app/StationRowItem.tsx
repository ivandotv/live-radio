import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { RadioStation } from '../../types'
import { PlayerStateIcon } from '../music-player/PlayerStateIcon'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'
import { useFilterDataStore } from './providers/StoreProvider'
import { TagList } from './TagList'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0
    },
    button: {
      paddingLeft: 0,
      display: 'flex',
      alignItems: 'initial'
    },
    playStopBtn: {
      marginRight: theme.spacing(1)
    },
    divider: {
      marginTop: theme.spacing(2)
    }
  })
})
export const StationRowItem = observer(function StationRowItem({
  station,
  showCountry = true,
  showFlag = true
}: {
  station: RadioStation
  showCountry?: boolean
  showFlag?: boolean
}) {
  const store = useFilterDataStore()
  const classes = useStyles()
  const player = useMusicPlayerStore()

  const togglePlay = useCallback(() => {
    player.togglePlay(station)
  }, [player, station])

  const tagClick = useCallback(
    (tag: string) => {
      store.search(store.query.length ? `${store.query} ${tag}` : `${tag}`, 0)
    },
    [store]
  )

  return (
    <ListItem className={classes.root} component="div">
      <ListItemText>
        <Button
          onClick={togglePlay}
          startIcon={
            <PlayerStateIcon stationId={station.id} fontSize="1.3rem" />
          }
          className={classes.button}
        >
          {`${station.name}`}
          {showCountry ? ` | ${station.country}` : null}
          {showFlag ? ` ${station.flag}` : null}
        </Button>
        <TagList tags={station.tags} onTagClick={tagClick} />
        <Divider component="div" className={classes.divider} />
      </ListItemText>
    </ListItem>
  )
})
