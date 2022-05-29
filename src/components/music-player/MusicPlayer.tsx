import { t } from '@lingui/macro'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { SHARED_CONFIG } from 'lib/shared/config'
import {
  AddTofavoritesBtn,
  PlayerToggleBtn,
  ShareStationBtn,
  SongInfo
} from 'components/music-player'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { logger } from 'lib/client/logger-browser'
import { AuthExpiredError } from 'lib/client/services/auth-service'
import { MediaSessionService } from 'lib/client/services/media-session-service'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const playerLogger = logger.child({ label: 'player' })

const layout = SHARED_CONFIG.layout

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
      color: 'inherit',
      '&:hover': {
        textDecoration: 'underline'
      }
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
  const { favoriteStations, recentStations, musicPlayer } = useRootStore()
  const classes = useStyles({
    drawerWidth: layout.desktopDrawerWidth
  })
  const { enqueueSnackbar } = useSnackbar()
  const [initialized, setInitialized] = useState(false)
  const [inFavorites, setInFavorites] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)

  /* This is safe beacause the code is removed in the production build
   */
  if (__DEV__) {
    // eslint-disable-next-line
    useEffect(() => {
      // @ts-expect-error - attaching to window is a bad idea
      window.player = musicPlayer
    }, [musicPlayer])
  }

  useEffect(() => {
    return reaction(
      () => musicPlayer.playerError,
      () => {
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
      }
    )
  }, [musicPlayer.playerError, enqueueSnackbar, classes.snackbar])

  useEffect(() => {
    if (errorLoading) {
      enqueueSnackbar(t`Error loading stations`, {
        variant: 'error',
        className: classes.snackbar,
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
      setErrorLoading(false)
    }
  }, [classes.snackbar, enqueueSnackbar, errorLoading])

  useEffect(() => {
    ;(async () => {
      try {
        await Promise.all([
          favoriteStations.loadStations(),
          recentStations.loadStations()
        ])
      } catch (err) {
        //if there is an error,  music player will set default station
        setErrorLoading(true)
        playerLogger.error(err)
      } finally {
        if (recentStations.stations.length) {
          musicPlayer.setStation(recentStations.stations[0].data)
        }
        setInFavorites(
          Boolean(
            musicPlayer.station &&
              favoriteStations.getStationById(musicPlayer.station._id)
          )
        )
        setInitialized(true)
      }
    })()
  }, [favoriteStations, recentStations, musicPlayer])

  useEffect(() => {
    new MediaSessionService(musicPlayer, navigator)

    return () => musicPlayer.stop()
  }, [musicPlayer])

  useEffect(() => {
    ;(async function () {
      const signInInterrupt = sessionStorage.getItem('signInInterrupt')
      if (signInInterrupt) {
        // play immediately
        //TODO -sessionStorage should be abstracted away
        sessionStorage.removeItem('signInInterrupt')
        musicPlayer.play(musicPlayer.station)
      }
    })()
  }, [musicPlayer])

  useEffect(() => {
    setInFavorites(
      Boolean(
        musicPlayer.station &&
          favoriteStations.getStationById(musicPlayer.station._id)
      )
    )
  }, [musicPlayer.station, favoriteStations, favoriteStations.stations.length, favoriteStations.stations.length])

  const toggleFavorites = async () => {
    const action = inFavorites ? 'remove' : 'add'
    const station = musicPlayer.station
    const model = favoriteStations.getStationById(musicPlayer.station._id)

    if (model && model.isSyncing) {
      return
    }

    try {
      if (inFavorites) {
        const result = await favoriteStations.deleteStation(station._id)
        console.dir(result)
        if (!result.error) {
          setInFavorites(false)
        } else {
          throw result.error
        }
      } else {
        await favoriteStations.saveStation(station, { addImmediately: false })
        setInFavorites(true)
      }
    } catch (e) {
      console.warn(e)
      if (e instanceof AuthExpiredError) {
        throw e
      }
      enqueueSnackbar(
        action === 'add'
          ? t`Error adding to  favorites`
          : t`Error removing from favorites`,
        {
          variant: 'error',
          className: classes.snackbar,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        }
      )
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.uiWrap}>
        {initialized ? (
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
