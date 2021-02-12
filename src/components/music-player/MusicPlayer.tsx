import { t } from '@lingui/macro'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { AddTofavoritesBtn } from 'components/music-player/AddToFavoritesBtn'
import { PlayerToggleBtn } from 'components/music-player/PlayerToggleBtn'
import { ShareStationBtn } from 'components/music-player/ShareStationBtn'
import { SongInfo } from 'components/music-player/SongInfo'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { layout } from 'app-config'
import { MediaSessionService } from 'lib/services/media-session-service'
import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { usePromise } from 'react-use'

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
      bottom: `${layout.playerHeight + theme.spacing(1)}px`,
      [theme.breakpoints.down('sm')]: {
        // opacity: 0.1
        bottom: `${
          layout.playerHeight + layout.mobileMenuHeight + theme.spacing(1)
        }px`
      }
    }
  })
)

export const MusicPlayer = observer(function MusicPlayer() {
  const { favoriteStations, musicPlayer } = useRootStore()
  const classes = useStyles({
    drawerWidth: layout.desktopDrawerWidth
  })
  const { enqueueSnackbar } = useSnackbar()
  const mounted = usePromise()

  const addFavSync = favoriteStations.syncs.add.get(musicPlayer.station.id)
  const removeFavSync = favoriteStations.syncs.add.get(musicPlayer.station.id)

  console.log('station name ', musicPlayer.station.name)
  /* This is safe beacause the code disappears in the production build
   */
  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-ignore
      window.player = musicPlayer
    }, [musicPlayer])
  }

  //todo - switch to mobx when
  useEffect(() => {
    if (musicPlayer.playerError) {
      enqueueSnackbar(t`Error playing radio station`, {
        variant: 'error',
        className: classes.snackbar,
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
    }
  }, [musicPlayer.playerError, enqueueSnackbar, classes.snackbar])

  useEffect(() => {
    favoriteStations.load()
  }, [favoriteStations])

  useEffect(() => {
    new MediaSessionService(musicPlayer, navigator)
  }, [musicPlayer])

  useEffect(() => {
    ;(async function () {
      await musicPlayer.init()
      const signInInterrupt = sessionStorage.getItem('signInInterrupt')
      if (signInInterrupt) {
        // play immediately
        // todo -sessionStorage should be abstracted away
        sessionStorage.removeItem('signInInterrupt')
        musicPlayer.play(musicPlayer.station)
      }
    })()
  }, [musicPlayer])

  const inFavorites = Boolean(
    musicPlayer.station &&
      favoriteStations.stations.find(
        (station) => musicPlayer.station.id === station.id
      )
  )

  const toggleFavorites = async () => {
    const action = inFavorites ? 'remove' : 'add'
    console.log('toggle favorites ', action)
    const station = musicPlayer.station
    favoriteStations.syncs.remove
    console.log('add fav sync ', addFavSync?.status)
    console.log('remove fav sync ', addFavSync?.status)
    if (addFavSync?.status === 'pending' || removeFavSync?.status === 'pending')
      return
    console.log('toggle favorites action!!!!')
    try {
      if (inFavorites) {
        await mounted(favoriteStations.remove(station.id))
      } else {
        await mounted(favoriteStations.add(station, true))
      }
    } catch {
      enqueueSnackbar(
        action === 'add'
          ? 'Error adding to  favorites'
          : 'Error removing from favorites',
        {
          variant: 'error',
          className: classes.snackbar,
          onExited: () => {},
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        }
      )
    } finally {
      // favoriteStations.cleanupSync('remove', station.id)
      // favoriteStations.cleanupSync('add', station.id)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.uiWrap}>
        {musicPlayer.station ? (
          <div className={classes.column}>
            <PlayerToggleBtn fontSize="3.3rem" />
            <AddTofavoritesBtn
              fontSize="2.5rem"
              active={inFavorites}
              onClick={toggleFavorites}
              inFavorites={inFavorites}
            />
            <ShareStationBtn fontSize="2.2rem" />
            <div className={classes.infoWrap}>
              <Tooltip title={t`Go to station website`}>
                <a
                  href={musicPlayer.station.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.stationLink}
                >
                  <span className={classes.stationName}>
                    {musicPlayer.station.name}
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
    </div>
  )
})
