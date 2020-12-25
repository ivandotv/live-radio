import List from '@material-ui/core/List'
import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { LocationModal } from 'components/locationModal/LocationModal'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { SyntheticEvent, useState } from 'react'
import { getStaticTranslations } from 'initTranslations'
import { LocationStoreProvider } from 'components/providers/LocationStoreProvider'

export { getStaticTranslations as getStaticProps }

export default function Search() {
  const [dialogOpen, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div style={{ overflowY: 'auto' }}>
      <PageTitle title={t`Search For Radio Stations`} />
      <LocationStoreProvider>
        <LocationModal open={dialogOpen} onClose={handleCloseDialog} />
      </LocationStoreProvider>
      <List>
        <AppMenuItem
          onClick={(e: SyntheticEvent) => {
            e.preventDefault()
            handleOpenDialog()
          }}
          primary={t`Local Radio`}
        />
        <AppMenuItem
          link={{ href: '/app/search/by-location' }}
          primary={t`By Location`}
        />
        <AppMenuItem
          link={{ href: '/app/search/by-language' }}
          primary={t`By Language`}
        />
        <AppMenuItem
          link={{ href: '/app/search/by-genre' }}
          primary={t`By Genre`}
        />
        <AppMenuItem
          link={{ href: '/app/search/custom' }}
          primary={t`Custom Search`}
        />
      </List>
    </div>
  )
}

Search.layout = AppDefaultLayout
