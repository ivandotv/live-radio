import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationModal } from 'components/LocationModal'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { SyntheticEvent, useState } from 'react'

export default function Search() {
  const [dialogOpen, setOpenDialog] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <>
      <PageTitle title="Search For Radio Stations" />
      <LocationModal open={dialogOpen} onClose={handleCloseDialog} />
      <List>
        <AppMenuItem
          onClick={(e: SyntheticEvent) => {
            e.preventDefault()
            handleClickOpen()
          }}
          primary="Local Radio"
        />
        <AppMenuItem
          link={{ href: '/app/search/by-location' }}
          primary="By Location"
        />
        <AppMenuItem
          link={{ href: '/app/search/by-language' }}
          primary="By Language"
        />
        <AppMenuItem
          link={{ href: '/app/search/by-genre' }}
          primary="By Genre"
        />
        <AppMenuItem
          link={{ href: '/app/search/custom' }}
          primary="Custom Search"
        />
      </List>
    </>
  )
}

Search.layout = AppDefaultLayout
