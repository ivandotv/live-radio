import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useCallback } from 'react'
import useSWR from 'swr'
import { RadioStation } from 'types'
import { useMusicPlayer } from './providers/RootStoreProvider'

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

const queryProgressText = 'Finding station'
const queryErrorText = 'Sorry, requested station is not available'
const querySuccessText = 'Station found'

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error()
    }
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
  const player = useMusicPlayer()

  const { data, error } = useSWR<RadioStation[]>(
    open ? `/api/stationinfo?play=${encodeURIComponent(play)}` : null,
    fetcher,
    { shouldRetryOnError: false }
  )

  const station = data && data.length > 0 ? data[0] : undefined

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  function playStation() {
    player.play(station!)
    handleClose()
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
          : error
          ? queryErrorText
          : queryProgressText}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          {station ? (
            <Typography variant="h5" color="textPrimary">
              Play: {station.name}
            </Typography>
          ) : !error ? (
            <CircularProgress />
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {station || error ? (
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        ) : null}
        {station ? (
          <Button onClick={playStation} color="primary" autoFocus>
            play
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
