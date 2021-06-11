import { t, Trans } from '@lingui/macro'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import { client } from 'lib/utils'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTitle: {
      textAlign: 'center'
    },
    flag: {
      color: '#000000'
    },
    actionColors: {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.contrastText
          : theme.palette.primary.main
    }
  })
})

//todo - this should be a state machine
export const LocationModal = observer(function LocationModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const classes = useStyles()
  const router = useRouter()

  const [state, doFetch] = useAsyncFn(async () => {
    const data = await client<{
      cont: string
      code: string
      flag: string
      name: string
    }>('/api/geolocation')

    return data
  })

  useEffect(() => {
    if (open) {
      console.log('do fetch')
      doFetch()
    }
  }, [open, doFetch])

  const countryData = useMemo(() => {
    const data = state.value
    if (data) {
      return {
        link: {
          href: 'app/by-location/[continent]/[country]',
          as: `app/by-location/${data.cont}/${data.code}`
        },
        flag: data.flag,
        country: data.name
      }
    }
  }, [state.value])

  const goToBrowseByLocation = () => {
    router.push('app/by-location')
  }

  const goToCountryStations = () => {
    router.push(countryData!.link.href, countryData!.link.as)
  }

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {countryData ? (
          <Trans>Your location is</Trans>
        ) : state.error ? (
          <Trans> Sorry, couldn&apos;t get your location</Trans>
        ) : (
          <Trans>Determinig your location</Trans>
        )}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          {countryData ? (
            <Typography component="h3" variant="h3" color="textPrimary">
              <span className={classes.flag}>{countryData.flag}</span>
              {countryData.country}
            </Typography>
          ) : !state.error ? (
            <CircularProgress />
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actionColors}>
        {state.error ? (
          <Button onClick={handleClose} color="inherit">
            {t`close`}
          </Button>
        ) : null}
        {countryData || state.error ? (
          <>
            <Button onClick={goToBrowseByLocation} color="inherit">
              {countryData ? (
                <Trans>Let me choose different location</Trans>
              ) : (
                <Trans>Let me choose the location</Trans>
              )}
            </Button>
          </>
        ) : null}
        {countryData ? (
          <Button onClick={goToCountryStations} color="inherit" autoFocus>
            <Trans>Okay, let&apos;s go</Trans>
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
})
