import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import { useState } from 'react'
import { AppDefaultLayout } from '../../../components/app/layout/AppDefaultLayout'
import { LocationModal } from '../../../components/app/LocationModal'
import { AppMenuItem } from '../../../components/app/sidebars/AppMenuItem'
import { PageTitle } from '../../../components/PageTitle'

export default function Browse() {
  // dataSuccess = true
  // data = {}
  // data.country = 'Serrrbia  '
  // error = false

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
        <AppMenuItem
          link={{ href: '/app/browse/custom' }}
          primary="Custom Search"
        />
      </List>
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
