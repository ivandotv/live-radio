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
import { layout, enableServiceWorker } from 'browser-config'
import { AppToolbar } from 'components/layout/AppToolbar'
import LoginNotification from 'components/LoginNotification'
import { MusicPlayer } from 'components/music-player/MusicPlayer'
import { DesktopNavigation } from 'components/navigation/desktop/DesktopNavigation'
import { MobileNavigation } from 'components/navigation/mobile/MobileNavigation'
import { OfflineIndicator } from 'components/OfflineIndicator'
import { useRootStore } from 'components/providers/RootStoreProvider'
import InstallBanner from 'components/pwa-prompt/InstallBanner'
import UpdateBanner from 'components/pwa-prompt/UpdateBanner'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'
import { Workbox } from 'workbox-window'

// todo - make the values dynamic
const { playerHeight, mobileMenuHeight, topBarHeight, mainContentSpacer } =
  layout

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
      // position: 'absolute',
      width: '100%',
      // top: '-27px', //magic!
      zIndex: 2
    },
    contentSpacer: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(2)
      },
      minHeight: topBarHeight
    }
  })
)

export const AppShell = observer(function AppShell({
  children
}: {
  children: ReactNode
}) {
  const { appShell, serviceWorker: serviceWorkerStore } = useRootStore()
  const theme = useTheme()
  const classes = useStyles()
  const router = useRouter()
  const locale = router.locale || router.defaultLocale!

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (enableServiceWorker && !serviceWorkerStore.wb) {
        const wb = new Workbox('/sw.js', { scope: '/' })
        serviceWorkerStore.register(wb)
      }
    }
  }, [serviceWorkerStore])

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
        <link
          key="font-roboto"
          rel="stylesheet"
          as="font"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          crossOrigin="anonymous"
        />
        <link
          rel="manifest"
          key="manifest"
          crossOrigin="use-credentials"
          href={`/api/manifest?locale=${locale}`}
        />
      </Head>
      <CssBaseline />
      <div
        style={{ opacity: appShell.showApp ? 1 : 0 }}
        className={classes.root}
      >
        <AppToolbar />
        <InstallBanner />
        <UpdateBanner />
        <LoginNotification />
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
                <MusicPlayer />
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
