import { t } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useRootStore } from './providers/RootStoreProvider'

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

export function PlayFromShareModal({
  open,
  play,
  onClose
}: {
  open: boolean
  play: string
  onClose: () => void
}) {
  const classes = useStyles()
  const { musicPlayer } = useRootStore()

  const queryProgressText = t`Finding station`
  const querySuccessText = t`Station found`
  const queryErrorText = t`Sorry, requested station is not available`

  const [state, doFetch] = useAsyncFn((id) => musicPlayer.getStationInfo(id))

  useEffect(() => {
    if (open) {
      doFetch(play)
    }
  }, [open, doFetch, play])

  const station = state.value ? state.value[0] : undefined

  function playStation() {
    musicPlayer.play(station!)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {station
          ? querySuccessText
          : state.error
          ? queryErrorText
          : queryProgressText}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          {station ? (
            <Typography variant="h5" color="textPrimary">
              {t`Play`}: {station.name}
            </Typography>
          ) : !state.error ? (
            <CircularProgress />
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {station || state.error ? (
          <Button onClick={onClose} color="primary">
            {t`close`}
          </Button>
        ) : null}
        {station ? (
          <Button onClick={playStation} color="primary" autoFocus>
            {t`play`}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
