import { t } from '@lingui/macro'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Alert from '@material-ui/lab/Alert'
import { AddTofavoritesBtn } from 'components/music-player/AddToFavoritesBtn'
import { PlayerToggleBtn } from 'components/music-player/PlayerToggleBtn'
import { ShareStationBtn } from 'components/music-player/ShareStationBtn'
import { SongInfo } from 'components/music-player/SongInfo'
import {
  useAppShell,
  useMusicPlayer,
  useRootStore
} from 'components/providers/RootStoreProvider'
import { layout } from 'lib/appSettings'
import { AppMediaSession } from 'lib/MediaSession'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      overflow: 'hidden',
      height: `${layout.playerHeight}px`,
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
      flexDirection: 'column',
      width: '100%'
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
    stationLink: {
      textDecoration: 'none',
      color: 'inherit'
    },
    snackbar: {
      bottom: `${layout.playerHeight + theme.spacing(2)}px`
    }
  })
)

export const MusicPlayer = observer(function MusicPlayer() {
  const player = useMusicPlayer()
  const appShell = useAppShell()
  const { favorites } = useRootStore()
  const classes = useStyles({
    drawerWidth: appShell.desktopDrawerWidth
  })
  const [snackErrorOpen, setSnackErrorOpen] = useState(false)
  const [snackFavOpen, setSnackFavOpen] = useState(false)

  /* This is safe beacause the code disappears in the production build
   */
  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-ignore
      window.player = player
    }, [player])
  }

  useEffect(() => {
    if (player.playerError) {
      setSnackErrorOpen(true)
    }
  }, [player.playerError])

  useEffect(() => {
    favorites.load()
  }, [favorites])

  useEffect(() => {
    new AppMediaSession(player, navigator)
  }, [player])

  useEffect(() => {
    player.init()
  }, [player])

  const onSnackClose = (_: SyntheticEvent, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackErrorOpen(false)
    setSnackFavOpen(false)
  }
  const inFavorites = Boolean(
    player.station && favorites.get(player.station.id)
  )

  const togglefavorites = () => {
    if (inFavorites) {
      favorites.remove(player.station.id)
    } else {
      favorites.add(player.station)
    }
    setSnackFavOpen(true)
  }

  return (
    <div className={classes.root}>
      <div className={classes.uiWrap}>
        {player.station ? (
          <div className={classes.column}>
            <PlayerToggleBtn fontSize="3.3rem" />
            <AddTofavoritesBtn
              fontSize="2.5rem"
              active={inFavorites}
              onClick={togglefavorites}
            />
            <ShareStationBtn fontSize="2.2rem" />
            <div className={classes.infoWrap}>
              <Tooltip title={t`Go to station website`}>
                <a
                  href={player.station.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.stationLink}
                >
                  <span className={classes.stationName}>
                    {player.station.name}
                  </span>
                </a>
              </Tooltip>
              <div className={classes.songInfo}>
                <SongInfo />
              </div>
            </div>
          </div>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackErrorOpen || snackFavOpen}
        autoHideDuration={2500}
        onClose={onSnackClose}
        className={classes.snackbar}
      >
        {snackErrorOpen ? (
          <Alert severity="error">{t`Error playing radio station`}</Alert>
        ) : (
          <Alert severity="success">
            {inFavorites ? t`Added to favorites` : t`Removed from favourites`}
          </Alert>
        )}
      </Snackbar>
    </div>
  )
})
