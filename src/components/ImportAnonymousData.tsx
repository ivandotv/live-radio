import { t, Trans } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { cookies } from 'browser-config'
import clsx from 'clsx'
import { PageLoadError } from 'components/PageLoadError'
import { useRootStore } from 'components/providers/RootStoreProvider'
import Cookies from 'js-cookie'
import { observer } from 'mobx-react-lite'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    modal: {
      display: 'flex',
      flexDirection: 'column'
    },
    modalTitle: {
      textAlign: 'center'
    },
    loadingContent: {
      alignItems: 'center',
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
        2
      )}px`
    },
    errorContent: {
      minWidth: 300
    },
    dataDeletedContent: {}
  })
})

export const ImportAnonymousData = observer(function ImportAnonymousData() {
  const { appShell } = useRootStore()
  const { data: session } = useSession()
  const authChecked = useRef(false)
  const classes = useStyles()
  const [importError, setImportError] = useState<null | string>(null)
  const [open, setOpen] = useState(false)
  const [importInProgress, setImportInProgress] = useState(false)
  const [dataDeleted, setDataDeleted] = useState(false)
  const [dataImported, setDataImported] = useState(false)
  const [formValues, setFormValues] = useState({
    favs: false,
    recent: false,
    anim: false
  })

  async function startImport() {
    setImportInProgress(true)

    const result = await appShell.transferAnonymousData(
      formValues.favs,
      formValues.recent,
      formValues.anim
    )
    if (result.error) {
      setImportError(result.error)
    }
    setImportInProgress(false)
    setDataImported(true)
  }

  function cancelImport() {
    Cookies.set(
      cookies.anonymousImportDissmissed.name,
      cookies.anonymousImportDissmissed.value,
      cookies.anonymousImportDissmissed.options
    )
    setOpen(false)
  }

  async function deleteData() {
    await appShell.deleteAnonymousData()
    setDataDeleted(true)
  }
  // eslint-disable-next-line
  const onClose = () => {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        ...{ [e.target.name]: e.target.checked }
      }
    })
  }

  useEffect(() => {
    if (session && !authChecked.current) {
      authChecked.current = true
      if (session) {
        ;(async () => {
          const isDismissed = Cookies.get(
            cookies.anonymousImportDissmissed.name
          )
          const shouldOpen = await appShell.hasAnonymousData()

          if (shouldOpen && isDismissed !== '1') {
            setOpen(true)
          }
        })()
      } else {
        Cookies.remove(cookies.anonymousImportDissmissed.name, {
          sameSite: 'strict'
        })
      }
    }
  }, [session, appShell])

  const mainContent = (
    <>
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Import Data`}
      </DialogTitle>

      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          <Typography>{t`It appears that you have switched from the anonymous mode.
           Would you like to import your favorite and recently listened stations
            from the anonymous account to your current account?
   `}</Typography>
        </DialogContentText>
        <div>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onChange={handleChange} name="favs" />}
              label={t`Import favorite stations`}
            />
            <FormControlLabel
              control={<Checkbox onChange={handleChange} name="recent" />}
              label={t`Import recently listened stations`}
            />
            <FormControlLabel
              control={<Checkbox onChange={handleChange} name="anim" />}
              label={t`Remove anonymous data after import`}
            />
          </FormGroup>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelImport} color="inherit">
          <Trans>No thanks</Trans>
        </Button>
        <Button onClick={deleteData} color="inherit">
          <Trans>Just delete anonymous data</Trans>
        </Button>
        <Button
          onClick={startImport}
          color="inherit"
          disabled={!formValues.favs && !formValues.recent}
        >
          <Trans>Okay</Trans>
        </Button>
      </DialogActions>
    </>
  )

  const loadingContent = (
    <>
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Import in progress`}
      </DialogTitle>

      <DialogContent className={clsx([classes.modal, classes.loadingContent])}>
        <CircularProgress />
      </DialogContent>
    </>
  )

  const errorContent = (
    <>
      <DialogContent className={clsx([classes.modal, classes.errorContent])}>
        <PageLoadError
          onClick={startImport}
          data={<p>{t`Error importing data`}</p>}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelImport} color="inherit">
          <Trans>Cancel</Trans>
        </Button>
      </DialogActions>
    </>
  )

  const dataDeletedContent = (
    <>
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Success`}
      </DialogTitle>
      <DialogContent
        className={clsx([classes.modal, classes.dataDeletedContent])}
      >
        <p>
          <Trans>Anonymous data deleted</Trans>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelImport} color="inherit">
          <Trans>Ok</Trans>
        </Button>
      </DialogActions>
    </>
  )

  const dataImportedContent = (
    <>
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {t`Success`}
      </DialogTitle>
      <DialogContent className={clsx([classes.modal])}>
        <p>
          <Trans>Anonymous data imported</Trans>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelImport} color="inherit">
          <Trans>Ok</Trans>
        </Button>
      </DialogActions>
    </>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={t`import data`}
      aria-describedby={t`Import data from anonymous account`}
    >
      {importInProgress
        ? loadingContent
        : importError
        ? errorContent
        : dataDeleted
        ? dataDeletedContent
        : dataImported
        ? dataImportedContent
        : mainContent}
    </Dialog>
  )
})
