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
import { AppConstants } from 'lib/constants'
import { MusicPlayer } from 'components/music-player/MusicPlayer'
import { useAppShell } from 'components/providers/RootStoreProvider'
import { DesktopSidebar } from 'components/sidebars/DesktopSidebar'
import { AppToolbar } from 'components/layout/AppToolbar'

// todo - make the value dynamic for responsive layout
const playerAndTopBarOffset = AppConstants.layout.playerHeight + 72
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    navWrapper: {
      zIndex: theme.zIndex.appBar - 1
    },
    pageWrap: {
      display: 'flex',
      flexDirection: 'column',
      height: `calc( 100vh - ${playerAndTopBarOffset}px )`
    },
    contentSpacer: {
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
  children
}: {
  children: ReactNode
}) {
  const store = useAppShell()
  const theme = useTheme()
  const classes = useStyles()

  return (
    <>
      <Head>
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
          <Hidden smDown implementation="css">
            <DesktopSidebar />
          </Hidden>
        </nav>

        <main className={classes.content}>
          <div className={classes.contentSpacer} />
          <Container maxWidth="md" disableGutters>
            {/* https://github.com/mui-org/material-ui/issues/21711 */}
            <Paper>
              <div className={classes.pageWrap}>{children as ReactElement}</div>
              <MusicPlayer></MusicPlayer>
            </Paper>
          </Container>
        </main>
      </div>
    </>
  )
})
