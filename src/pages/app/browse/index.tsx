import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useState } from 'react'
import { AppDefaultLayout } from '../../../components/app/layout/AppDefaultLayout'
import { LocationModal } from '../../../components/app/LocationModal'
import { AppMenuItem } from '../../../components/app/sidebars/AppMenuItem'
import { PageTitle } from '../../../components/PageTitle'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 182px )' // todo calculate the value dinamically
    }
  })
})

export default function Browse() {
  // dataSuccess = true
  // data = {}
  // data.country = 'Serrrbia  '
  // error = false

  const classes = useStyles()
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
