import Slide from '@material-ui/core/Slide'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { observer } from 'mobx-react-lite'
import PwaNotification from './PwaNotification'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    notif: {
      position: 'absolute',
      width: '100%',
      top: 0,
      zIndex: 1101
    }
  })
)

const PWABanner = observer(function PWABanner() {
  const { appShell } = useRootStore()
  const classes = useStyles()

  return (
    <Slide
      direction="down"
      in={appShell.showInstallPrompt}
      mountOnEnter
      unmountOnExit
    >
      <PwaNotification
        onClose={appShell.hideInstallPrompt.bind(appShell)}
        className={classes.notif}
        installFn={appShell.installPWA.bind(appShell)}
      />
    </Slide>
  )
})

export default PWABanner
