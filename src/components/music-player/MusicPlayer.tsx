import { deepPurple } from '@material-ui/core/colors'
import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MuiAlert from '@material-ui/lab/Alert'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useAppShell } from '../app/providers/AppShellProvider'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { AddToFavouritesBtn } from './AddToFavouritesBtn'
import { FullScreenBtn } from './FullScrenBtn'
import { PlayerStateIcon } from './PlayerStateIcon'
import { ShareStationBtn } from './ShareStationBtn'
import { SongInfo } from './SongInfo'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      overflow: 'hidden',
      bottom: 0,
      height: '110px',
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 'none',
      padding: theme.spacing(1)
    },
    appBarSpacer: {
      ...theme.mixins.toolbar
    },
    uiWrap: {
      display: 'flex',
      flexDirection: 'column'
    },
    column: {
      display: 'flex',
      alignItems: 'center'
      // marginLeft: theme.spacing(1)
    },
    infoWrap: {
      display: 'flex',
      flexDirection: 'column'
    },
    artistWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    songInfo: {
      display: 'flex',
      flexDirection: 'column',
      zIndex: -1,
      '& p': {
        // fontSize: '1.1rem',
        margin: 0
      }
    },
    artistArtwork: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1),
      width: 48,
      height: 48,
      postition: 'relative',
      zIndex: 2
    },
    stationName: {
      marginRight: theme.spacing(1),
      fontSize: '1.7rem',
      margin: 0
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
  const iconSize = '2rem'

  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-ignore
      window.player = player
    }, [player])
  }
  const togglePlay = useCallback(() => {
    player.togglePlay()
  }, [player])

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
          <p className={classes.stationName}>{player.station?.name}</p>
          <AddToFavouritesBtn fontSize={iconSize} />
          <ShareStationBtn fontSize={iconSize} />
          <FullScreenBtn fontSize={iconSize} />
        </div>
        <div className={classes.column}>
          <span onClick={togglePlay}>
            <PlayerStateIcon fontSize="55px"></PlayerStateIcon>
          </span>
          <div className={classes.infoWrap}>
            <div className={classes.artistWrap}>
              <div className={classes.songInfo}>
                <SongInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
