import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Play from '@material-ui/icons/PlayArrow'
import Loading from '@material-ui/icons/RotateLeft'
import Stop from '@material-ui/icons/Stop'
import Error from '@material-ui/icons/Warning'
import { observer } from 'mobx-react-lite'
import { ReactNode, useCallback } from 'react'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      //   padding: theme.spacing(0.5)
      padding: 2
    },
    loading: {
      animation: '$rotation 1000ms infinite linear'
    },
    error: {
      color: theme.palette.error.main
    },
    icon: {
      fontSize: ({ fontSize }: { fontSize: string | number }) => fontSize,
      color: theme.palette.primary.contrastText
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

export const PlayerToggleBtn = observer(function PlayerToggleBtn({
  fontSize,
  stationId
}: {
  fontSize: string | number
  stationId?: string
}) {
  const player = useMusicPlayer()
  const classes = useStyles({ fontSize })
  let btn: ReactNode | null = null

  const togglePlay = useCallback(() => {
    player.togglePlay()
  }, [player])

  const errorBtn = (
    <Tooltip placement="top" title="Try playing this station again">
      <IconButton className={classes.button} size="medium" color="secondary">
        <Error classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )

  const playBtn = (
    <Tooltip placement="top" title="Play">
      <IconButton className={classes.button} size="medium">
        <Play classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )

  if (!stationId || (player.station && stationId === player.station.id)) {
    if (player.status === PlayerStatus.PLAYING) {
      btn = (
        <Tooltip placement="top" title="Stop">
          <IconButton className={classes.button} size="medium">
            <Stop classes={{ root: classes.icon }} />
          </IconButton>
        </Tooltip>
      )
    } else if (
      player.status === PlayerStatus.STOPPED ||
      player.status === PlayerStatus.PAUSED
    ) {
      btn = playBtn
    } else if (player.status === PlayerStatus.BUFFERING) {
      btn = (
        <Tooltip placement="top" title="Station is loading">
          <IconButton className={classes.button} size="medium">
            <Loading
              className={`${classes.loading}`}
              classes={{ root: classes.icon }}
            />
          </IconButton>
        </Tooltip>
      )
    } else if (
      player.status === PlayerStatus.ERROR
      // player.errorStations[stationId || '']
    ) {
      btn = errorBtn
    }
  } else if (player.errorStations[stationId]) {
    btn = errorBtn
  } else {
    btn = playBtn
  }

  return <span onClick={togglePlay}>{btn}</span>
})
