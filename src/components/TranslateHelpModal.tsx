import { t, Trans } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTitle: {
      textAlign: 'center'
    }
  })
})

export function TranslateHelpModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="help-me-translate">
        {t`Help me translate`}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="help-me-translate">
          <Typography>
            <Trans>Help me translate the application to more languages.</Trans>
          </Typography>
          <Typography>
            <Trans>
              Just head over to the{' '}
              <a
                href="https://github.com/ivandotv/live-radio"
                target="_blank"
                rel="noreferrer"
              >
                code repository
              </a>{' '}
              and open an issue.{' '}
            </Trans>
          </Typography>
          <Typography>
            <Trans>
              For example, Spanish translation (if not already open):{' '}
              <strong>[translation][Spanish]</strong>
            </Trans>
          </Typography>
          <Typography>
            <Trans>Thanks! 👍</Trans>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {t`OK`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
