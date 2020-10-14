import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from '../app/providers/MusicPlayerProvider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Pause from '@material-ui/icons/PauseCircleFilled'
import Play from '@material-ui/icons/PlayCircleFilledWhite'
import Loading from '@material-ui/icons/RotateLeft'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'

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

export const PlayStopBtn = observer(function PlayStopBtn({
  fontSize
}: {
  fontSize: string
}) {
  const player = useMusicPlayerStore()
  const classes = useStyles({ fontSize })

  if (player.status === PlayerStatus.PLAYING) {
    return <Pause className={classes.button}></Pause>
  } else if (
    player.status === PlayerStatus.STOPPED ||
    player.status === PlayerStatus.PAUSED
  ) {
    return <Play className={classes.button}></Play>
  } else if (player.status === PlayerStatus.BUFFERING) {
    return (
      <Loading
        className={`${classes.loading} ${classes.button}`}
        style={{ fontSize }}
      ></Loading>
    )
  }

  return null
})
