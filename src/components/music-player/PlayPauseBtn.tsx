import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from '../app/providers/MusicPlayerProvider'
import Pause from '@material-ui/icons/PauseCircleFilled'
import Play from '@material-ui/icons/PlayCircleFilledWhite'
import Loading from '@material-ui/icons/RotateLeft'

export const PlayPauseBtn = observer(function PlayPauseBtn({
  uuid
}: {
  uuid: string
}) {
  const player = useMusicPlayerStore()

  function getBtn() {
    if (player.stationUUID === uuid) {
      if (player.status === 'playing') {
        return <Pause></Pause>
      } else if (player.status === 'stopped' || player.status === 'paused') {
        return <Play></Play>
      } else if (player.status === 'buffering') {
        return <Loading></Loading>
      }
    } else {
      return <Play></Play>
    }
  }

  const btn = getBtn()

  return <>{btn}</>
})
