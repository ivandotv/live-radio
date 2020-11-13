import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import Paper from '@material-ui/core/Paper'
import { PageTitle } from 'components/PageTitle'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { stationPlaceholder } from 'lib/stationUtils'

let instantPlayTriggered = false

export default function Browse() {
  const router = useRouter()
  const player = useMusicPlayer()

  useEffect(() => {
    const { play, name, id } = router.query

    if (play && name && id && !instantPlayTriggered) {
      //play the station immediately
      const station = stationPlaceholder(
        decodeURI(play as string),
        decodeURIComponent(name as string),
        decodeURIComponent(id as string)
      )

      player.play(station)
      instantPlayTriggered = true
    }
  }, [router, player])

  return (
    <Paper>
      <PageTitle title=" Next Radio App" />
      <h1>App Root = ovde staviti recent i tako to</h1>
    </Paper>
  )
}

Browse.layout = AppDefaultLayout
