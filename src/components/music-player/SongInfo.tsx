import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { PlayerStatus } from 'lib/stores/MusicPlayerStore'
import { observer } from 'mobx-react-lite'
import { t } from '@lingui/macro'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    artist: {},
    songTitle: {}
  })
)

export const SongInfo = observer(function SongInfo() {
  const player = useMusicPlayer()
  const classes = useStyles()

  let artist = player.songInfo?.artist || t`No Data`
  let songTitle = player.songInfo?.title || t`No Data`

  const showInfo =
    player.status !== PlayerStatus.STOPPED &&
    player.status !== PlayerStatus.BUFFERING &&
    player.stationChecked

  return (
    <Collapse in={showInfo}>
      <div>
        <span className={classes.artist}>{artist}</span>
        {player.songInfo?.artist ? (
          <>
            <span> / </span>
            <span className={classes.songTitle}>{songTitle}</span>
          </>
        ) : null}
      </div>
    </Collapse>
  )
})
