import { t } from '@lingui/macro'
import { IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import MenuCloseIcon from '@material-ui/icons/ArrowBack'
import DarkIcon from '@material-ui/icons/Brightness6'
import LightIcon from '@material-ui/icons/Brightness7'
import MenuIcon from '@material-ui/icons/Menu'
import { sections } from 'browser-config'
import { LanguageSwitcher } from 'components/LanguageSwitcher'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { TranslateHelpModal } from 'components/TranslateHelpModal'
import { UserProfileDropdown } from 'components/UserProfileDropdown'
import { searchTranslation } from 'lib/utils'
import { observer } from 'mobx-react-lite'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButtonDesktop: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    appToolbar: {
      alignItems: 'flex-end'
    },
    elementLeft: {
      marginRight: 'auto',
      display: 'flex',
      alignItems: 'center'
    },
    elementsWrap: {
      justifyContent: 'flex-end',
      width: '100%'
    }
  })
)

function useSetAppTitle(separator: string, defaultTitle: string) {
  const router = useRouter()
  const [title, setTitle] = useState(defaultTitle)

  useEffect(() => {
    const pathParts = router.pathname.split('/')

    console.log({ pathParts })
    let prettyTitle = title
    if (pathParts.length > 2) {
      prettyTitle = searchTranslation(
        pathParts[2].replace('/', separator),
        sections()
      )
    } else if (pathParts[1] === 'app') {
      prettyTitle = searchTranslation(
        pathParts[1].replace('/', separator),
        sections()
      )
    }
    setTitle(prettyTitle)
  }, [separator, router.pathname, title])

  return title
}

export const AppToolbar = observer(function AppToolbar() {
  const theme = useTheme()
  const classes = useStyles()
  const appTitle = useSetAppTitle(' / ', '')
  const { appShell } = useRootStore()

  const [openTransHelp, setOpenTransHelp] = useState(false)

  const [session] = useSession()

  appShell.setUserIsSignedIn(Boolean(session))

  const closeTransHelpModal = useCallback(() => {
    setOpenTransHelp(false)
  }, [])

  const onLanguageSwitch = (key: string) => {
    if (key == 'help') {
      setOpenTransHelp(true)
    }
  }
  const toggleDesktopDrawer = () => {
    appShell.setDesktopDrawer(!appShell.desktopDrawerIsOpen)
  }

  const toggleTheme = () => {
    appShell.setTheme(appShell.theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <AppBar
      color={theme.palette.type === 'light' ? 'primary' : 'default'}
      position="fixed"
      elevation={0}
      classes={{ root: classes.appToolbar }}
    >
      <Toolbar variant="dense" classes={{ root: classes.elementsWrap }}>
        <div className={classes.elementLeft}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDesktopDrawer}
            className={classes.menuButtonDesktop}
          >
            {appShell.desktopDrawerIsOpen ? <MenuCloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap>
            {appTitle}
          </Typography>
        </div>
        <UserProfileDropdown />
        <LanguageSwitcher onChange={onLanguageSwitch} />
        <TranslateHelpModal
          open={openTransHelp}
          onClose={closeTransHelpModal}
        ></TranslateHelpModal>
        <Tooltip
          title={
            appShell.theme === 'dark'
              ? t`Switch to Light Theme`
              : t`Switch to Dark Theme`
          }
          aria-label="toggle dark/light theme"
        >
          <IconButton color="inherit" onClick={toggleTheme} edge="end">
            {appShell.theme === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
})
