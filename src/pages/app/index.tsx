import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import Paper from '@material-ui/core/Paper'
import { PageTitle } from 'components/PageTitle'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { PlayFromShareModal } from 'components/PlayFromShareModal'

let instantPlayTriggered = false

export default function Browse() {
  const router = useRouter()
  const player = useMusicPlayer()
  const [openDialog, setOpenDialog] = useState(false)
  const play = router.query.play as string

  useEffect(() => {
    if (play && !instantPlayTriggered) {
      //play the station immediately
      instantPlayTriggered = true
      setOpenDialog(true)
    }
  }, [play, player])

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper>
      <PageTitle title="Next Radio App" />
      <h1>App Root = ovde staviti recent i tako to</h1>
      <PlayFromShareModal
        open={openDialog}
        onClose={handleCloseDialog}
        play={play}
      />
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
