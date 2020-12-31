import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useRootStore } from 'components/providers/RootStoreProvider'
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
  const { musicPlayer } = useRootStore()
  const classes = useStyles()

  let artist = musicPlayer.songInfo?.artist || t`No Data`
  let songTitle = musicPlayer.songInfo?.title || t`No Data`

  const showInfo =
    musicPlayer.status !== PlayerStatus.STOPPED &&
    musicPlayer.status !== PlayerStatus.BUFFERING &&
    musicPlayer.stationChecked

  return (
    <Collapse in={showInfo}>
      <div>
        <span className={classes.artist}>{artist}</span>
        {musicPlayer.songInfo?.artist ? (
          <>
            <span> / </span>
            <span className={classes.songTitle}>{songTitle}</span>
          </>
        ) : null}
      </div>
    </Collapse>
  )
})
