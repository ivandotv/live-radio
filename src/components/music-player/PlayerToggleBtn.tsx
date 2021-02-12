import { t } from '@lingui/macro'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Play from '@material-ui/icons/PlayArrow'
import Loading from '@material-ui/icons/RotateLeft'
import Stop from '@material-ui/icons/Stop'
import Error from '@material-ui/icons/Warning'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { PlayerStatus } from 'lib/stores/music-player-store'
import { observer } from 'mobx-react-lite'
import { ReactNode, useCallback } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
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
  const { musicPlayer } = useRootStore()
  const classes = useStyles({ fontSize })
  let btn: ReactNode | null = null

  const togglePlay = useCallback(() => {
    musicPlayer.togglePlay()
  }, [musicPlayer])

  const errorBtn = (
    <Tooltip placement="top" title={t`Try playing this station again`}>
      <IconButton className={classes.button} size="medium" color="secondary">
        <Error classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )

  const playBtn = (
    <Tooltip placement="top" title={t`Play`}>
      <IconButton className={classes.button} size="medium">
        <Play classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )

  if (
    !stationId ||
    (musicPlayer.station && stationId === musicPlayer.station.id)
  ) {
    if (musicPlayer.status === PlayerStatus.PLAYING) {
      btn = (
        <Tooltip placement="top" title={t`Stop`}>
          <IconButton className={classes.button} size="medium">
            <Stop classes={{ root: classes.icon }} />
          </IconButton>
        </Tooltip>
      )
    } else if (
      musicPlayer.status === PlayerStatus.STOPPED ||
      musicPlayer.status === PlayerStatus.PAUSED
    ) {
      btn = playBtn
    } else if (musicPlayer.status === PlayerStatus.BUFFERING) {
      btn = (
        <Tooltip placement="top" title={t`Station is loading`}>
          <IconButton className={classes.button} size="medium">
            <Loading
              className={`${classes.loading}`}
              classes={{ root: classes.icon }}
            />
          </IconButton>
        </Tooltip>
      )
    } else if (musicPlayer.status === PlayerStatus.ERROR) {
      btn = errorBtn
    }
  } else if (musicPlayer.errorStations[stationId]) {
    btn = errorBtn
  } else {
    btn = playBtn
  }

  return <span onClick={togglePlay}>{btn}</span>
})
