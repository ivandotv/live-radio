import { observer } from 'mobx-react-lite'
import Avatar from '@material-ui/core/Avatar'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'

export const ArtistArtwork = observer(function ArtistArtwork({
  className = ''
}: {
  className?: string
}) {
  const goFullScreen = () => {}
  const player = useMusicPlayer()
  const titleFirstLetter = player.songInfo?.title.slice(0, 1) ?? '?'
  const artistFirstLetter = player.songInfo?.artist.slice(0, 1) ?? ''

  return (
    <Avatar onClick={goFullScreen} variant="rounded" className={className}>
      {`${titleFirstLetter}${artistFirstLetter}`}
    </Avatar>
  )
})
