import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { RadioStation } from '../../types'
import { PlayerStateIcon } from '../music-player/PlayerStateIcon'
import { useMusicPlayer } from './providers/MusicPlayerProvider'
import { StationRowTags } from './StationRowTags'
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0
    },
    textItem: {
      margin: 0
    },
    stationSelected: {
      // borderLeft: '5px solid red',
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
      borderLeftColor: theme.palette.primary.light
    },
    stationError: {
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
      borderLeftColor: theme.palette.error.main
    },
    button: {
      display: 'flex',
      // alignItems: 'center',
      alignItems: 'initial'
      // paddingLeft: 0
    },
    tags: {
      display: 'inline-block',
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1)
      // marginTop: theme.spacing(-1)
    },
    // icon: {
    //   display: 'inline-block',
    //   marginRight: theme.spacing(1)
    // },
    playStopBtn: {
      marginRight: theme.spacing(1)
    },
    divider: {}
  })
})
export const StationRowItem = observer(function StationRowItem({
  station,
  showCountry = true,
  showFlag = true,
  showTags = true
}: {
  station: RadioStation
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
}) {
  const classes = useStyles()
  const player = useMusicPlayer()

  const togglePlay = useCallback(() => {
    player.togglePlay(station)
  }, [player, station])

  const stationError = player.errorStations[station.id]

  return (
    <ListItem className={clsx(classes.root, {})} component="div">
      <ListItemText
        className={clsx(classes.textItem, {
          [classes.stationSelected]:
            player.station?.id === station.id &&
            player.status !== PlayerStatus.ERROR,
          [classes.stationError]: stationError
        })}
      >
        <Button onClick={togglePlay} className={classes.button}>
          <PlayerStateIcon stationId={station.id} fontSize="1.3rem" />
          {`${station.name}`}
          {showCountry ? ` | ${station.country}` : null}
          {showFlag ? ` ${station.flag}` : null}
        </Button>
        {showTags ? (
          <StationRowTags className={classes.tags} station={station} />
        ) : null}
        <Divider component="div" className={classes.divider} />
      </ListItemText>
    </ListItem>
  )
})
