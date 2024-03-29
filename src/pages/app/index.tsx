import { t } from '@lingui/macro'
import List from '@material-ui/core/List'
import { AppDefaultLayout } from 'components/layout'
import { LocationModal } from 'components/LocationModal'
import { AppMenuItem } from 'components/navigation/desktop/MenuItem'
import { PageTitle } from 'components/PageTitle'
import { PlayFromShareModal } from 'components/PlayFromShareModal'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { getStaticTranslations } from 'lib/server/utils'
import { useRouter } from 'next/router'
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react'

export { getStaticTranslations as getStaticProps }

export default function Search() {
  const [dialogOpen, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const router = useRouter()
  const { musicPlayer } = useRootStore()
  const [openPlayDialog, setOpenPlayDialog] = useState(false)
  const play = router.query.play as string
  const instantPlayTriggered = useRef(false)

  useEffect(() => {
    if (play && !instantPlayTriggered.current) {
      //play the station immediately
      instantPlayTriggered.current = true
      setOpenPlayDialog(true)
    }
  }, [play, musicPlayer])

  const handleClosePlayDialog = useCallback(() => {
    setOpenPlayDialog(false)
  }, [])

  return (
    <div style={{ overflowY: 'auto' }}>
      <PageTitle title={t`Search For Radio Stations`} />
      <LocationModal open={dialogOpen} onClose={handleCloseDialog} />
      <List>
        <AppMenuItem
          testId="local-radio"
          onClick={(e: SyntheticEvent) => {
            e.preventDefault()
            handleOpenDialog()
          }}
          primary={t`Local Radio`}
        />
        <AppMenuItem
          testId="by-location"
          link={{
            href: '/app/by-location'
          }}
          primary={t`By Location`}
        />
        <AppMenuItem
          testId="by-language"
          link={{ href: '/app/by-language' }}
          primary={t`By Language`}
        />
        <AppMenuItem
          testId="by-genre"
          link={{ href: '/app/by-genre' }}
          primary={t`By Genre`}
        />
        <AppMenuItem
          testId="custom-search"
          link={{ href: '/app/custom' }}
          primary={t`Custom Search`}
        />
      </List>
      <PlayFromShareModal
        open={openPlayDialog}
        onClose={handleClosePlayDialog}
        play={play}
      />
    </div>
  )
}

Search.layout = AppDefaultLayout
