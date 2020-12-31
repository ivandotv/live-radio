import { t } from '@lingui/macro'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
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
import { sections } from 'lib/appSettings'
import { searchTranslation } from 'lib/utils'
import { observer } from 'mobx-react-lite'
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
    if (pathParts[2]) {
      const title = pathParts[2].replace('/', separator)
      setTitle(searchTranslation(title, sections()))
    } else {
      setTitle(defaultTitle)
    }
  }, [separator, router.pathname, defaultTitle])

  return title
}

export const AppToolbar = observer(function AppToolbar() {
  const theme = useTheme()
  const classes = useStyles()
  const appTitle = useSetAppTitle(' / ', '')
  const { appShell } = useRootStore()

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
        <LanguageSwitcher></LanguageSwitcher>
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
