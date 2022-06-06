import { t } from '@lingui/macro'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useClientUrl } from 'lib/client/hooks'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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

export const AuthExpiredModal = observer(function TranslateHelpModal() {
  const { appShell } = useRootStore()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const callbackUrl = useClientUrl(`/${router.locale}${router.pathname}`)

  // eslint-disable-next-line
  const onClose = () => {}

  useEffect(() => {
    return reaction(
      () => appShell.authExpired,
      (exp) => {
        if (exp) {
          setOpen(true)
        }
      }
    )
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Signed Out`}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          <Typography>{t`
	 It appears that you have been signed out.
   You will need to sign in again in order to continue to use the application`}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link
          variant="button"
          href={`/auth/sign-in?callbackUrl=${callbackUrl}`}
          color="primary"
        >
          {t`Sign in again`}
        </Link>
      </DialogActions>
    </Dialog>
  )
})
