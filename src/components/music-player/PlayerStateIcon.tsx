import { observer } from 'mobx-react-lite'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
// import Pause from '@material-ui/icons/PauseCircleFilled'
import Play from '@material-ui/icons/PlayCircleFilledWhite'
// import Stop from '@material-ui/icons/StopOutlined'
// import Stop from '@material-ui/icons/StopRounded'
import Stop from '@material-ui/icons/AlbumRounded'
import Loading from '@material-ui/icons/RotateLeft'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { ReactNode } from 'react'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    button: {
      cursor: 'pointer',
      fontSize: ({ fontSize }: { fontSize: string }) => fontSize
    },
    loading: {
      animation: '$rotation 1000ms infinite linear'
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
  stationId,
  className = ''
}: {
  fontSize: string
  className?: string
  stationId?: string
}) {
  const player = useMusicPlayer()
  const classes = useStyles({ fontSize })
  let btn: ReactNode | null = null

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
    }
  } else {
    btn = <Play className={classes.button}></Play>
  }

  return <>{btn}</>
})
