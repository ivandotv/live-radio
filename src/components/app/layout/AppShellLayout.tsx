import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import Zoom from '@material-ui/core/Zoom'
import Fade from '@material-ui/core/Fade'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import React, { ReactElement, ReactNode } from 'react'
import { useDesktopDrawerPosition } from '../../../lib/utils'
import { MusicPlayer } from '../../music-player/MusicPlayer'
// import { NextApplicationPage } from '../../../pages/_app'
import { useAppShell } from '../providers/AppShellProvider'
import { DesktopSidebar } from '../sidebars/DesktopSidebar'
import { MobileSidebar } from '../sidebars/MobileSidebar'
import { AppToolbar } from './AppToolbar'
import { useMusicPlayer } from '../providers/MusicPlayerProvider'
import { PlayerStatus } from '../../../lib/stores/MusicPlayerStore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    navWrapper: {
      zIndex: theme.zIndex.appBar - 1
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 182px )' // todo calculate the value dinamically
    },
    // appBarSpacer: {
    //   ...theme.mixins.toolbar
    // },
    contentSpacer: {
      // ...theme.mixins.toolbar,
      // media query - izbrisati za mobile varijantu
      paddingTop: theme.spacing(4),
      marginBottom: theme.spacing(5)
    },
    content: {
      width: '100%',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        padding: 0
      }
    }
  })
)

export const AppShellLayout = observer(function AppShellLayout({
  // desktopSidebar,
  // mobileSidebar,
  children
}: {
  // mobileSidebar?: NextApplicationPage['mobileSidebar']
  // desktopSidebar?: NextApplicationPage['desktopSidebar']
  children: ReactNode
}) {
  const store = useAppShell()
  const theme = useTheme()
  const classes = useStyles()
  const player = useMusicPlayer()

  return (
    <>
      <Head>
        <title>Next.js PWA</title>
        {store.showApp ? (
          <meta
            name="theme-color"
            key="theme-color"
            content={
              theme.palette.type === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.primary.main
            }
          />
        ) : null}
      </Head>
      <CssBaseline />
      <div style={{ opacity: store.showApp ? 1 : 0 }} className={classes.root}>
        <AppToolbar />
        <nav className={classes.navWrapper}>
          {/* <Hidden mdUp implementation="js">
            <MobileSidebar />
          </Hidden> */}
          <Hidden smDown implementation="css">
            <DesktopSidebar />
          </Hidden>
        </nav>

        <main className={classes.content}>
          <div className={classes.contentSpacer} />
          <Container maxWidth="md" disableGutters>
            {/* https://github.com/mui-org/material-ui/issues/21711 */}
            <Paper>
              <div className={classes.paper}>{children as ReactElement}</div>
              <MusicPlayer></MusicPlayer>
            </Paper>
          </Container>
        </main>
      </div>
    </>
  )
})
