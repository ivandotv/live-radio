import { t } from '@lingui/macro'
import { IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
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
import { LanguageSwitcher } from 'components/LanguageSwitcher'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { UserProfileDropdown } from 'components/UserProfileDropdown'
import { sections } from 'lib/appSettings'
import { searchTranslation } from 'lib/utils'
import { observer } from 'mobx-react-lite'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

  const [session] = useSession()

  if (session) {
    console.log('session loaded')
    console.log(session)
  } else {
    console.log('session is loading')
  }
  const [counter, setCounter] = useState(0)

  const toggleDesktopDrawer = () => {
    appShell.setDesktopDrawer(!appShell.desktopDrawerIsOpen)
  }

  const toggleTheme = () => {
    setCounter((counter) => {
      return counter + 1
    })
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
        <LanguageSwitcher />
        <Tooltip
          title={
            appShell.theme === 'dark'
              ? t`Switch to Light Theme`
              : t`Switch to Dark Theme`
          }
          aria-label="toggle dark/light theme"
        >
          <IconButton color="inherit" onClick={toggleTheme} edge="end">
            <Badge badgeContent={counter} color="secondary" showZero>
              {appShell.theme === 'dark' ? <LightIcon /> : <DarkIcon />}
            </Badge>
          </IconButton>
        </Tooltip>
        {/* </div> */}
      </Toolbar>
    </AppBar>
  )
})
