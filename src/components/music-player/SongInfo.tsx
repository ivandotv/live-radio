import { observer } from 'mobx-react-lite'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      left: -30,
      opacity: 0
    },
    animIn: {
      left: 0,
      opacity: 1
    },
    animOut: {
      left: -30,
      userSelect: 'none'
    },
    animWithDelay: {
      transitionDelay: '0.1s'
    }
  })
)

export const SongInfo = observer(function SongInfo() {
  const player = useMusicPlayer()
  const classes = useStyles()

  const calcClasses = clsx(classes.root, {
    [classes.animIn]:
      player.status !== PlayerStatus.STOPPED && player.stationChecked,
    [classes.animOut]: player.status === PlayerStatus.STOPPED
  })

  let artist, songTitle

  if (player.status === PlayerStatus.STOPPED) {
    artist = player.prevSongInfo?.artist || 'No Data'
    songTitle = player.prevSongInfo?.title || 'No Data'
  } else {
    artist = player.songInfo?.artist || 'No Data'
    songTitle = player.songInfo?.title || 'No Data'
  }

  return (
    <div>
      <p className={calcClasses}>
        <strong>{songTitle} </strong>
      </p>
      <p className={`${calcClasses} ${classes.animWithDelay}`}>{artist}</p>
    </div>
  )
})
