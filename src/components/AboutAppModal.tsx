import { t, Trans } from '@lingui/macro'
import Image from 'next/image'
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
      justifyContent: 'center',
      flexDirection: 'column',
      maxWidth: 400
    },
    modalTitle: {
      textAlign: 'center'
    }
  })
})

export function AboutAppModal({
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
      aria-describedby={t`about app explanation`}
    >
      <DialogContent className={classes.modal}>
        <Image
          alt={t`application name`}
          width="300"
          height="100"
          objectFit="contain"
          src="/images/app-name.png"
        />
        <Image
          alt={t`landing page image`}
          width="225"
          height="163"
          priority={true}
          src="/images/landing-page.png"
        />
        <DialogContentText component="div">
          <Typography>
            <Trans>
              <p>Web application for listening to online radio.</p>
            </Trans>
            <Trans>
              <p>
                If you want to learn about technologies used, or look at the
                source code, check out the{' '}
                <a
                  href="https://github.com/ivandotv/live-radio"
                  target="_blank"
                  rel="noreferrer"
                >
                  repository{' '}
                </a>
              </p>
            </Trans>
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
