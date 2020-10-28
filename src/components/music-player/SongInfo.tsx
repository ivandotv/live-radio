import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    artist: {
      // fontWeight: 'bold'
    },
    songTitle: {}
  })
)

export const SongInfo = observer(function SongInfo() {
  const player = useMusicPlayer()
  const classes = useStyles()

  let artist, songTitle

  if (player.status === PlayerStatus.STOPPED) {
    artist = player.prevSongInfo?.artist || 'No Data'
    songTitle = player.prevSongInfo?.title || 'No Data'
  } else {
    artist = player.songInfo?.artist || 'No Data'
    songTitle = player.songInfo?.title || 'No Data'
  }

  const showInfo =
    player.status !== PlayerStatus.STOPPED &&
    player.status !== PlayerStatus.BUFFERING &&
    player.stationChecked

  return (
    <Collapse in={showInfo}>
      <div>
        <span className={classes.artist}>{artist}</span>
        <span> / </span>
        <span className={classes.songTitle}>{songTitle}</span>
      </div>
    </Collapse>
  )
})
