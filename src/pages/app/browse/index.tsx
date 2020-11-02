import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationModal } from 'components/LocationModal'
import { AppMenuItem } from 'components/sidebars/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { useState } from 'react'

export default function Browse() {
  const [dialogOpen, setOpenDialog] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <>
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
    </>
  )
}

Browse.layout = AppDefaultLayout
