import Enter from '@material-ui/icons/Fullscreen'
import Exit from '@material-ui/icons/FullscreenExit'
import { observer } from 'mobx-react-lite'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { useAppShell } from '../app/providers/AppShellProvider'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    button: {
      cursor: 'pointer',
      fontSize: ({ fontSize }: { fontSize: string }) => fontSize
    }
  })
)

export const FullScreenBtn = observer(function FullScreenBtn({
  fontSize
}: {
  fontSize: string
}) {
  const isFullScreen = false
  const classes = useStyles({ fontSize })
  const appShell = useAppShell()

  function toggleFullScreen() {
    if (appShell.playerInFullScreen) {
      appShell.setPlayerFullScreen(false)
    } else {
      appShell.setPlayerFullScreen(true)
    }
  }

  return isFullScreen ? (
    <Tooltip placement="top" title="Exit fullscren player">
      <Exit onClick={toggleFullScreen} className={classes.button} />
    </Tooltip>
  ) : (
    <Tooltip placement="top" title="Enter full screen player">
      <Enter onClick={toggleFullScreen} className={classes.button} />
    </Tooltip>
  )
})
