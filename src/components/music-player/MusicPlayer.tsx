import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import Avatar from '@material-ui/core/Avatar'
import { deepOrange, deepPurple } from '@material-ui/core/colors'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import clsx from 'clsx'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import {
  MusicPlayerStore,
  PlayerStatus
} from '../../lib/stores/MusicPlayerStore'
import { PlayerStateIcon } from './PlayerStateIcon'
import { AddToFavouritesBtn } from './AddToFavouritesBtn'
import { ShareStationBtn } from './ShareStationBtn'
import { FullScreenBtn } from './FullScrenBtn'
import { useAppShell } from '../app/providers/AppShellProvider'
import { useEffect, useCallback } from 'react'
import { SongInfo } from './SongInfo'
import { ArtistArtwork } from './ArtistArtwork'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      width: '100%',
      display: 'flex',
      bottom: 0,
      height: '110px',
      zIndex: 10000,
      left: ({ drawerWidth }: { drawerWidth: number }) => drawerWidth,

      // maxHeight: 200,
      // height: 200,
      // height: ({ isFullScreen }: { isFullScreen: boolean }) =>
      //   isFullScreen ? '100%' : 'auto',
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 'none',
      // alignItems: 'center',
      padding: theme.spacing(1)
      // backgroundColor: '#123133'
      // transition: 'all 1s ease-in'
    },
    boxAnim: {
      transition: 'all 0.4s ease-in-out'
      // transition: theme.transitions.create(
      //   ['width', 'top', 'height', 'background-color', 'bottom', 'left'],
      //   {
      //     easing: theme.transitions.easing.easeIn,
      //     // duration: theme.transitions.duration.leavingScreen
      //     duration: 400
      //   }
      // )
    },
    heightFull: {
      // height: '100%',
      left: '0px!important',
      // width: '50%',
      height: '100%'
      // backgroundColor: '#ff99f2'
      // top: 100
      // left: '100px'
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
// music player is a global component
export const MusicPlayer = observer(function MusicPlayer() {
  const player = useMusicPlayer()
  const appShell = useAppShell()
  console.log('player is full screen ', appShell.playerInFullScreen)
  const classes = useStyles({
    isFullScreen: appShell.playerInFullScreen,
    drawerWidth: appShell.desktopDrawerWidth
  })
  // const classes = useStyles()
  const iconSize = '2rem'

  const testclick = function () {
    console.log('test click')
    if (appShell.playerInFullScreen) {
      appShell.setPlayerFullScreen(false)
    } else {
      appShell.setPlayerFullScreen(true)
    }
  }
  const togglePlay = useCallback(() => {
    player.togglePlay()
  }, [player])

  // const songInfo = () => {
  //   player.testSong()
  //   console.log('share click')
  // }

  return (
    <Paper
      variant="outlined"
      square
      className={clsx(classes.root, classes.boxAnim, {
        [classes.heightFull]: appShell.playerInFullScreen
      })}
    >
      <div className={classes.uiWrap}>
        {/* {appShell.playerInFullScreen ? (
          <div className={classes.appBarSpacer}></div>
        ) : null} */}
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
              <ArtistArtwork className={classes.artistArtwork}></ArtistArtwork>
              <div className={classes.songInfo}>
                <SongInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  )
})
