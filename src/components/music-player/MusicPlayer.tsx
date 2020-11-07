import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { AddToFavouritesBtn } from 'components/music-player/AddToFavouritesBtn'
import { PlayerToggleBtn } from 'components/music-player/PlayerToggleBtn'
import { ShareStationBtn } from 'components/music-player/ShareStationBtn'
import { SongInfo } from 'components/music-player/SongInfo'
import {
  useAppShell,
  useMusicPlayer
} from 'components/providers/RootStoreProvider'
import { AppSettings } from 'lib/appSettings'
import { AppMediaSession } from 'lib/MediaSession'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      overflow: 'hidden',
      height: `${AppSettings.layout.playerHeight}px`,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 'none',
      padding: theme.spacing(1),
      backgroundColor:
        theme.palette.type === 'light'
          ? theme.palette.primary.dark
          : theme.palette.grey[900],
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
      color: theme.palette.primary.contrastText,
      marginLeft: theme.spacing(0.5)
    },
    songInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    stationName: {
      fontWeight: 'bold'
    },
    snackbar: {
      bottom: `${AppSettings.layout.playerHeight + theme.spacing(2)}px`
    }
  })
)

export const MusicPlayer = observer(function MusicPlayer() {
  const player = useMusicPlayer()
  const appShell = useAppShell()
  const classes = useStyles({
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

  const onSnackClose = (_: SyntheticEvent, reason: string) => {
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

  useEffect(() => {
    new AppMediaSession(player, navigator)
  }, [player])

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackOpen}
        autoHideDuration={2500}
        onClose={onSnackClose}
        className={classes.snackbar}
      >
        <Alert severity="error">Error playing radio station</Alert>
      </Snackbar>

      <div className={classes.uiWrap}>
        <div className={classes.column}>
          <PlayerToggleBtn fontSize="3.3rem" />
          <AddToFavouritesBtn fontSize="2.5rem" />
          <ShareStationBtn fontSize="2.2rem" />
          <div className={classes.infoWrap}>
            <span className={classes.stationName}>{player.station.name}</span>
            <div className={classes.songInfo}>
              <SongInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
