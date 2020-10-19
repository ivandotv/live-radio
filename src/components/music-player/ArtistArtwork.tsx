import { observer } from 'mobx-react-lite'
import Avatar from '@material-ui/core/Avatar'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'

export const ArtistArtwork = observer(function ArtistArtwork({
  className = ''
}: {
  className?: string
}) {
  const goFullScreen = () => {}
  const player = useMusicPlayer()

  let firstWord =
    player.status !== PlayerStatus.STOPPED && player.stationChecked ? '?' : ''
  let secondWord = ''
  if (player.songInfo) {
    const words = player.songInfo.artist.split(' ')
    firstWord = words[0].slice(0, 1)
    if (words.length > 1) {
      secondWord = words[1].slice(0, 1)
    }
  }

  return (
    <Avatar onClick={goFullScreen} variant="rounded" className={className}>
      {`${firstWord}${secondWord}`}
    </Avatar>
  )
})
