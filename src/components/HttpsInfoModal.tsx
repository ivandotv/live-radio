import { t } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
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

export function HttpsInfoModal({
  open,
  onClose,
  text
}: {
  open: boolean
  onClose: () => void
  text: string
}) {
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          <Typography>{text}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {t`Close`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
