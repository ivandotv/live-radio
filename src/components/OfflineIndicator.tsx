import { Trans } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import WarningIcon from '@material-ui/icons/Warning'
import { observer } from 'mobx-react-lite'
import { useRootStore } from './providers/RootStoreProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    indicator: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.error.main,
      color: '#fff',
      margin: 0,
      fontSize: '1.2rem',
      padding: `${theme.spacing(1)}px`,
      position: 'absolute',
      top: '-43px'
    },
    text: {
      margin: `0 ${theme.spacing(1)}px`
    }
  })
)

const OfflineIndicator = observer(function OfflineIndicator({
  className
}: {
  className: string
}) {
  const { appShell } = useRootStore()
  const classes = useStyles()

  return (
    <div className={className}>
      {!appShell.isOnLine ? (
        <p className={classes.indicator}>
          <WarningIcon />
          <span className={classes.text}>
            <Trans>It appears that you are offline</Trans>
          </span>
          <WarningIcon />
        </p>
      ) : null}
    </div>
  )
})
export { OfflineIndicator }
