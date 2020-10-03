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
import { LocationModal } from '../../../components/app/LocationModal'
import { AppMenuItem } from '../../../components/app/sidebars/AppMenuItem'
import { PageTitle } from '../../../components/PageTitle'
import { countryDataByKey } from '../../../lib/utils'

export default function Browse() {
  // dataSuccess = true
  // data = {}
  // data.country = 'Serrrbia  '
  // error = false

  const router = useRouter()

  const [dialogOpen, setOpenDialog] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper>
      <PageTitle title="Browse For Radio Stations" />
      <LocationModal open={dialogOpen} onClose={handleCloseDialog} />
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
