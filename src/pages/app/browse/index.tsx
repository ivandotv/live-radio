import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { AppDefaultLayout } from '../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../components/app/sidebars/AppMenuItem'
import { PageTitle } from '../../../components/PageTitle'
import { countryDataByKey } from '../../../lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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
export default function Browse() {
  const { data, error } = useSWR<{ country: string; status: string }>(
    'http://ip-api.com/json/',
    fetcher
  )
  const dataSuccess = data && data.status === 'success'

  const countryData = useMemo(() => {
    if (data?.country) {
      const countryData = countryDataByKey('name', data.country)

      // build link here
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
  // dataSuccess = true
  // data = {}
  // data.country = 'Serrrbia  '
  // error = false

  const classes = useStyles()
  const router = useRouter()

  const [dialogOpen, setOpenDialog] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const goToBrowseByLocation = () => {
    router.push('browse/by-location')
  }

  const goToCountryStations = () => {
    router.push(countryData!.link.href, countryData!.link.as)
  }

  const queryProgressText = 'Determinig your location'
  const queryErrorText = "Sorry, couldn't get your location"
  const querySuccessText = 'Your location is '

  console.log('continent ', countryData)

  return (
    <Paper>
      <PageTitle title="Browse For Radio Stations" />
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
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
      <List>
        <AppMenuItem
          onClick={(e) => {
            e.preventDefault()
            handleClickOpen()
            console.log('local click')
          }}
          primary="Local Radio"
        />
        <AppMenuItem
          link={{ href: '/app/browse/by-location' }}
          primary="By Location"
        />
        <AppMenuItem
          link={{ href: '/app/browse/by-language' }}
          primary="By Language"
        />
        <AppMenuItem
          link={{ href: '/app/browse/by-genre' }}
          primary="By Genre"
        />
      </List>
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
