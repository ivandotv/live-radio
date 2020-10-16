import { observer } from 'mobx-react-lite'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      transition: 'all 0.3s ease-in-out',
      left: -30,
      opacity: 0
    },
    animIn: {
      left: 0,
      opacity: 1
    },
    animOut: {
      left: -30
    }
  })
)

export const SongInfo = observer(function SongInfo() {
  const player = useMusicPlayer()
  const classes = useStyles()

  return (
    <div
      className={clsx(classes.root, {
        [classes.animIn]: player.songInfo,
        [classes.animOut]: !player.songInfo
      })}
    >
      <p>
        <strong>{player.songInfo?.title || player.prevSongInfo?.title} </strong>
      </p>
      <p>{player.songInfo?.artist || player.prevSongInfo?.artist}</p>
    </div>
  )
})
