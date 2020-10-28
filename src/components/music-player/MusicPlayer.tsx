import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MuiAlert from '@material-ui/lab/Alert'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useEffect, useState } from 'react'
import { AppConstants } from '../../lib/constants'
import { useAppShell } from '../app/providers/AppShellProvider'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { AddToFavouritesBtn } from './AddToFavouritesBtn'
import { PlayerToggleBtn } from './PlayerToggleBtn'
import { ShareStationBtn } from './ShareStationBtn'
import { SongInfo } from './SongInfo'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      overflow: 'hidden',
      bottom: 0,
      height: `${AppConstants.layout.playerHeight}px`,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 'none',
      padding: theme.spacing(1),
      backgroundColor:
        theme.palette.type === 'light'
          ? theme.palette.primary.dark
          : theme.palette.background.default,
      alignItems: 'center'
    },
    uiWrap: {
      display: 'flex',
      flexDirection: 'column'
    },
    column: {
      display: 'flex',
      alignItems: 'center'
    },
    infoWrap: {
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.primary.contrastText
    },
    songInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    stationName: {
      fontSize: '1.2rem'
    }
  })
)

export const MusicPlayer = observer(function MusicPlayer() {
  const player = useMusicPlayer()
  const appShell = useAppShell()
  console.log('player is full screen ', appShell.playerInFullScreen)
  const classes = useStyles({
    isFullScreen: appShell.playerInFullScreen,
    drawerWidth: appShell.desktopDrawerWidth
  })

  /* This is safe beacause the value changes only on production build
     The code dissapears in the production build
  */
  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-ignore
      window.player = player
    }, [player])
  }

  const [snackOpen, setSnackOpen] = useState(false)

  const handleClose = (_: SyntheticEvent, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
  }

  useEffect(() => {
    if (player.playerError) {
      setSnackOpen(true)
    }
  }, [player.playerError])

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Error playing radio station
        </Alert>
      </Snackbar>

      <div className={classes.uiWrap}>
        <div className={classes.column}>
          <PlayerToggleBtn fontSize="3.3rem" />
          <AddToFavouritesBtn fontSize="2.6rem" />
          <ShareStationBtn fontSize="2.3rem" />
          <div className={classes.infoWrap}>
            <span className={classes.stationName}>{player.station?.name}</span>
            <div className={classes.songInfo}>
              <SongInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
