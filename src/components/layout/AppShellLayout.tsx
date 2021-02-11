import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import Paper from '@material-ui/core/Paper'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { layout } from 'app-config'
import { MusicPlayer } from 'components/music-player/MusicPlayer'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { DesktopNavigation } from 'components/navigation/desktop/DesktopNavigation'
import { MobileNavigation } from 'components/navigation/mobile/MobileNavigation'
import { AppToolbar } from 'components/layout/AppToolbar'
import { OfflineIndicator } from 'components/OfflineIndicator'

// todo - make the values dynamic
const {
  playerHeight,
  mobileMenuHeight,
  topBarHeight,
  mainContentSpacer
} = layout

const desktopContentHeight = playerHeight + topBarHeight + mainContentSpacer
const mobileContentHeight = playerHeight + topBarHeight + mobileMenuHeight

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    pageWrap: {
      display: 'flex',
      flexDirection: 'column',
      height: `calc( 100vh - ${desktopContentHeight}px )`,

      [theme.breakpoints.down('sm')]: {
        padding: 0,
        height: `calc( 100vh - ${mobileContentHeight}px )`
      }
    },
    content: {
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      [theme.breakpoints.down('md')]: {
        padding: 0
      }
    },
    navWrapper: {
      zIndex: theme.zIndex.appBar - 1
    },
    bottomUiWrap: {
      position: 'relative',
      width: '100%',
      bottom: 0,
      zIndex: 1
    },
    offlineIndicator: {
      position: 'absolute',
      width: '100%',
      top: '-27px' //magic!
    },
    contentSpacer: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(2)
      },
      minHeight: topBarHeight
    }
  })
)

export const AppShellLayout = observer(function AppShellLayout({
  children
}: {
  children: ReactNode
}) {
  const { appShell } = useRootStore()
  const theme = useTheme()
  const classes = useStyles()

  return (
    <>
      <Head>
        {appShell.showApp ? (
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
      <div
        style={{ opacity: appShell.showApp ? 1 : 0 }}
        className={classes.root}
      >
        <AppToolbar />
        <nav className={classes.navWrapper}>
          <Hidden smDown implementation="css">
            <DesktopNavigation />
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.contentSpacer} />
          <Container maxWidth="md" disableGutters>
            {/* https://github.com/mui-org/material-ui/issues/21711 */}
            <Paper>
              <div className={classes.pageWrap}>{children as ReactElement}</div>
              <div className={classes.bottomUiWrap}>
                <OfflineIndicator className={classes.offlineIndicator} />
                <MusicPlayer></MusicPlayer>
                <Hidden mdUp implementation="css">
                  <MobileNavigation />
                </Hidden>
              </div>
            </Paper>
          </Container>
        </main>
      </div>
    </>
  )
})
