import { t } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useCallback } from 'react'

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

  const goToSite = useCallback(() => {
    onClose()
    window.open(`https://www.google.com`, '_blank')
  }, [onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Help me Translate`}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          <Typography>{t`
	 If you are enjoying the application you could help me translate it to more languages.
Just head over to site.com to start translating. Thanks! 👍`}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {t`Not right now`}
        </Button>
        <Button onClick={goToSite} color="primary">
          {t`Sure, let's go`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
