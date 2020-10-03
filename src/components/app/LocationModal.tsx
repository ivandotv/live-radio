import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'
import { countryDataByKey } from './../../lib/utils'

const useStyles = makeStyles((_theme: Theme) => {
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
    }
  })
})

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function LocationModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const classes = useStyles()
  const router = useRouter()

  const { data, error } = useSWR<{ country: string; status: string }>(
    'http://ip-api.com/json/',
    fetcher
  )
  const dataSuccess = data && data.status === 'success'

  const countryData = useMemo(() => {
    if (data?.country) {
      const countryData = countryDataByKey('name', data.country)

      if (countryData) {
        return {
          link: {
            href: 'browse/by-location/[continent]/country/[country]',
            as: `browse/by-location/${countryData.cont}/country/${countryData.code}`
          },
          flag: countryData.flag
        }
      }
    }
  }, [data])
  const goToBrowseByLocation = () => {
    router.push('browse/by-location')
  }

  const goToCountryStations = () => {
    router.push(countryData!.link.href, countryData!.link.as)
  }

  const queryProgressText = 'Determinig your location'
  const queryErrorText = "Sorry, couldn't get your location"
  const querySuccessText = 'Your location is '

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
        {dataSuccess && countryData
          ? querySuccessText
          : error || !dataSuccess || !countryData
          ? queryErrorText
          : queryProgressText}
      </DialogTitle>
      <DialogContent className={classes.modal}>
        <DialogContentText component="div" id="alert-dialog-description">
          {dataSuccess && countryData ? (
            <Typography component="h2" variant="h2" color="textPrimary">
              <span className={classes.flag}>{countryData.flag}</span>
              {data!.country}
            </Typography>
          ) : !data ? (
            <CircularProgress />
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {data || error ? (
          <Button onClick={goToBrowseByLocation} color="primary">
            {dataSuccess && countryData
              ? 'Let me choose different location'
              : 'Let me choose the location'}
          </Button>
        ) : null}
        {dataSuccess && countryData ? (
          <Button onClick={goToCountryStations} color="primary" autoFocus>
            {"Okay, let's go"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
