import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useAppShell } from '../providers/AppShellProvider'
import { Menu } from './Menu'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: (props: { drawerWidth: number }) => props.drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: (props: { drawerWidth: number }) => props.drawerWidth
    },
    appBarSpacer: {
      ...theme.mixins.toolbar
    },
    box: {
      marginLeft: ({ drawerWidth }: { drawerWidth: number }) => {
        return drawerWidth * -1
      }
    },
    boxAnim: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    boxShift: {
      height: '100vh',
      marginLeft: 0
    },
    boxShiftAnim: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  })
)

export const DesktopSidebar = observer(function DesktopSidebar() {
  const store = useAppShell()
  const classes = useStyles({ drawerWidth: store.desktopDrawerWidth })
  const theme = useTheme()

  return (
    <Box
      className={clsx(classes.drawer, {
        [classes.box]: !store.desktopDrawerIsOpen,
        [classes.boxAnim]: !store.desktopDrawerIsOpen && store.showApp,
        [classes.boxShift]: store.desktopDrawerIsOpen,
        [classes.boxShiftAnim]: store.desktopDrawerIsOpen && store.showApp
      })}
    >
      <Drawer
        anchor="left"
        variant="persistent"
        open={store.desktopDrawerIsOpen}
        /* eslint-disable */
        // transitionDuration={0}
        transitionDuration={
          store.showApp && false
            ? {
                appear: 0,
                enter: theme.transitions.duration.enteringScreen,
                exit: theme.transitions.duration.leavingScreen
              }
            : 0
        }
        // /* eslint-enable */
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.appBarSpacer}></div>
        <Menu position="desktop" />
      </Drawer>
    </Box>
  )
})
