import { observer } from 'mobx-react-lite'
import { useMusicPlayerStore } from '../app/providers/MusicPlayerProvider'
import Pause from '@material-ui/icons/PauseCircleFilled'
import Play from '@material-ui/icons/PlayCircleFilledWhite'
import Loading from '@material-ui/icons/RotateLeft'
import {
  MusicPlayerStore,
  PlayerStatus
} from '../../lib/stores/MusicPlayerStore'
import { PlayerStateIcon } from './PlayerStateIcon'

function getBtn(player: MusicPlayerStore, id: string) {
  if (player.stationID === id) {
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

export const PlayPauseBtn = observer(function PlayPauseBtn({
  id
}: {
  id: string
}) {
  const player = useMusicPlayerStore()

  // return <> {getBtn(player, id)}</>
  return <PlayerStateIcon></PlayerStateIcon>
})
