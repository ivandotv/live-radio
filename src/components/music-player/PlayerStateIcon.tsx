import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
// import Pause from '@material-ui/icons/PauseCircleFilled'
// import Play from '@material-ui/icons/PlayCircleFilledWhite'
import Play from '@material-ui/icons/PlayArrow'
import Loading from '@material-ui/icons/RotateLeft'
// import Stop from '@material-ui/icons/StopOutlined'
// import Stop from '@material-ui/icons/StopRounded'
// import Stop from '@material-ui/icons/AlbumRounded'
import Stop from '@material-ui/icons/Stop'
// import Error from '@material-ui/icons/ErrorOutline'
import Error from '@material-ui/icons/Warning'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      cursor: 'pointer',
      position: 'relative',
      fontSize: ({ fontSize }: { fontSize: string }) => fontSize
    },
    loading: {
      animation: '$rotation 1000ms infinite linear'
    },
    error: {
      color: theme.palette.error.main
    },
    '@keyframes rotation': {
      from: {
        transform: 'rotate(360deg)'
      },
      to: {
        transform: 'rotate(0deg)'
      }
    }
  })
)

export const PlayerStateIcon = observer(function PlayerStateIcon({
  fontSize,
  stationId
}: {
  fontSize: string
  stationId?: string
}) {
  const player = useMusicPlayer()
  const classes = useStyles({ fontSize })
  let btn: ReactNode | null = null

  const error = <Error className={`${classes.error} ${classes.button}`} />

  if (!stationId || (player.station && stationId === player.station.id)) {
    if (player.status === PlayerStatus.PLAYING) {
      // btn = <Pause className={classes.button}></Pause>
      btn = <Stop className={classes.button}></Stop>
    } else if (
      player.status === PlayerStatus.STOPPED ||
      player.status === PlayerStatus.PAUSED
    ) {
      btn = <Play className={classes.button}></Play>
    } else if (player.status === PlayerStatus.BUFFERING) {
      btn = (
        <Loading
          className={`${classes.loading} ${classes.button}`}
          style={{ fontSize }}
        ></Loading>
      )
    } else if (
      player.status === PlayerStatus.ERROR
      // player.errorStations[stationId || '']
    ) {
      btn = error
    }
  } else if (player.errorStations[stationId]) {
    btn = error
  } else {
    btn = <Play className={classes.button}></Play>
  }

  return <>{btn}</>
})
