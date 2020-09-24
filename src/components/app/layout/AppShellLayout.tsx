import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import Head from 'next/head'
import React, { ReactElement, ReactNode } from 'react'
import { useDesktopDrawerPosition } from '../../../lib/utils'
// import { NextApplicationPage } from '../../../pages/_app'
import { useAppShell } from '../AppShellProvider'
import { DesktopSidebar } from '../sidebars/DesktopSidebar'
import { MobileSidebar } from '../sidebars/MobileSidebar'
import { AppToolbar } from './AppToolbar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    navWrapper: {
      zIndex: theme.zIndex.appBar - 1
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
      [theme.breakpoints.down('md')]: {
        padding: 0
      }
    }
  })
)

export const AppShellLayout = ({
  // desktopSidebar,
  // mobileSidebar,
  children
}: {
  // mobileSidebar?: NextApplicationPage['mobileSidebar']
  // desktopSidebar?: NextApplicationPage['desktopSidebar']
  children: ReactNode
}) => {
  const { state } = useAppShell()
  const theme = useTheme()
  const classes = useStyles()

  useDesktopDrawerPosition(useAppShell)

  return (
    <>
      <Head>
        <title>Next.js PWA</title>
        {state.showApp ? (
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
      <div style={{ opacity: state.showApp ? 1 : 0 }} className={classes.root}>
        <AppToolbar />
        <nav className={classes.navWrapper}>
          <Hidden mdUp implementation="js">
            <MobileSidebar />
          </Hidden>
          <Hidden smDown implementation="css">
            <DesktopSidebar />
          </Hidden>
        </nav>

        <main className={classes.content}>
          <div className={classes.contentSpacer} />
          <Container maxWidth="md" disableGutters>
            {/* https://github.com/mui-org/material-ui/issues/21711 */}
            {children as ReactElement}
          </Container>
        </main>
      </div>
    </>
  )
}
