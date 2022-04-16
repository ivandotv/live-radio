import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { layout } from 'lib/shared/config'
import clsx from 'clsx'
import { Menu } from 'components/navigation/desktop/Menu'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { observer } from 'mobx-react-lite'

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

export const DesktopNavigation = observer(function DesktopNavigation() {
  const { appShell: appShell } = useRootStore()
  const classes = useStyles({ drawerWidth: layout.desktopDrawerWidth })
  const theme = useTheme()

  return (
    <Box
      className={clsx(classes.drawer, {
        [classes.box]: !appShell.desktopDrawerIsOpen,
        [classes.boxAnim]: !appShell.desktopDrawerIsOpen && appShell.showApp,
        [classes.boxShift]: appShell.desktopDrawerIsOpen,
        [classes.boxShiftAnim]: appShell.desktopDrawerIsOpen && appShell.showApp
      })}
    >
      <Drawer
        anchor="left"
        variant="persistent"
        open={appShell.desktopDrawerIsOpen}
        transitionDuration={
          appShell.showApp && appShell.animateDesktopDrawer
            ? {
                appear: 0,
                enter: theme.transitions.duration.enteringScreen,
                exit: theme.transitions.duration.leavingScreen
              }
            : 0
        }
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.appBarSpacer}></div>
        <Menu />
      </Drawer>
    </Box>
  )
})
