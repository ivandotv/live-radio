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
import {
  enablePWAInstallBanner,
  enableServiceWorker,
  enableServiceWorkerReload,
  layout,
  pwaInstallDismissedCookie,
  pwaUpdatedCookieName,
  serviceWorkerPath,
  serviceWorkerScope
} from 'browser-config'
import { AuthExpiredModal } from 'components/AuthExpiredModal'
import { ImportAnonymousData } from 'components/ImportAnonymousData'
import { AppToolbar } from 'components/layout/AppToolbar'
import LoginNotification from 'components/LoginNotification'
import { MusicPlayer } from 'components/music-player/MusicPlayer'
import { DesktopNavigation } from 'components/navigation/desktop/DesktopNavigation'
import { MobileNavigation } from 'components/navigation/mobile/MobileNavigation'
import { OfflineIndicator } from 'components/OfflineIndicator'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { AppUpdatedNotification } from 'components/pwa-prompt/AppUpdatedNotification'
import { InstallBanner } from 'components/pwa-prompt/InstallBanner'
import { UpdateBanner } from 'components/pwa-prompt/UpdateBanner'
import { useOfflineNotification } from 'lib/hooks/useOfflineNotification'
import { usePWAInstall } from 'lib/hooks/usePWAInstall'
import { useServiceWorker } from 'lib/hooks/useServiceWorker'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'

//TODO - make the values dynamic
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
      width: '100%',
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
  const { appShell } = useRootStore()

  const [isOnline] = useOfflineNotification()

  const theme = useTheme()
  const classes = useStyles()
  const router = useRouter()
  const locale = router.locale || router.defaultLocale!

  const [showPrompt, hideUpdatePrompt, update] = useServiceWorker({
    path: serviceWorkerPath,
    scope: serviceWorkerScope,
    enable: enableServiceWorker,
    enableReload: enableServiceWorkerReload,
    updateCookieName: pwaUpdatedCookieName
  })

  const [showInstallPrompt, installPWA, hideInstallPrompt] = usePWAInstall({
    enable: enablePWAInstallBanner,
    cookieName: pwaInstallDismissedCookie
  })

  useEffect(() => {
    appShell.setIsOnline(isOnline)
  }, [isOnline, appShell])

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
        <InstallBanner
          onCancel={() => hideInstallPrompt(false)}
          onOk={installPWA}
          show={showInstallPrompt}
        />
        <UpdateBanner
          onCancel={hideUpdatePrompt}
          onOk={update}
          show={showPrompt}
        />
        <LoginNotification />
        <AuthExpiredModal />
        <ImportAnonymousData />
        <AppUpdatedNotification cookieName={pwaUpdatedCookieName} />
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
