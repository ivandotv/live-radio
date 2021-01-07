import useOnlineStatus from '@rehooks/online-status'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Trans } from '@lingui/macro'
import WarningIcon from '@material-ui/icons/Warning'

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
      padding: `0 ${theme.spacing(1)}px`
    },
    text: {
      margin: `0 ${theme.spacing(1)}px`
    }
  })
)

export function OfflineIndicator({ className }: { className: string }) {
  const isOnline = useOnlineStatus()
  const classes = useStyles()

  return (
    <div className={className}>
      {!isOnline ? (
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
}
