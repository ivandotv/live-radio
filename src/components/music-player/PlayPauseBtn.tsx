import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from '../app/providers/MusicPlayerProvider'
import Pause from '@material-ui/icons/PauseCircleFilled'
import Play from '@material-ui/icons/PlayCircleFilledWhite'
import Loading from '@material-ui/icons/RotateLeft'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'

export const PlayPauseBtn = observer(function PlayPauseBtn({
  uuid
}: {
  uuid: string
}) {
  const player = useMusicPlayerStore()

  function getBtn() {
    if (player.stationID === uuid) {
      if (player.status === PlayerStatus.PLAYING) {
        return <Pause></Pause>
      } else if (
        player.status === PlayerStatus.STOPPED ||
        player.status === PlayerStatus.PAUSED
      ) {
        return <Play></Play>
      } else if (player.status === PlayerStatus.BUFFERING) {
        return <Loading></Loading>
      }
    } else {
      return <Play></Play>
    }
  }

  const btn = getBtn()

  return <>{btn}</>
})
