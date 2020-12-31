import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import Paper from '@material-ui/core/Paper'
import { PageTitle } from 'components/PageTitle'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { PlayFromShareModal } from 'components/PlayFromShareModal'
import { Trans } from '@lingui/macro'
import { getStaticTranslations } from 'initTranslations'
import { t } from '@lingui/macro'

let instantPlayTriggered = false

export { getStaticTranslations as getStaticProps }

export default function Browse() {
  const router = useRouter()
  const { musicPlayer } = useRootStore()
  const [openDialog, setOpenDialog] = useState(false)
  const play = router.query.play as string

  useEffect(() => {
    if (play && !instantPlayTriggered) {
      //play the station immediately
      instantPlayTriggered = true
      setOpenDialog(true)
    }
  }, [play, musicPlayer])

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper>
      <PageTitle title={t`Live Radio`} />
      <Trans>
        <h1>App Root = ovde staviti recent i ostale varijante</h1>
      </Trans>
      <PlayFromShareModal
        open={openDialog}
        onClose={handleCloseDialog}
        play={play}
      />
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
