import ShareIcon from '@material-ui/icons/ShareOutlined'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { observer } from 'mobx-react-lite'
import IconButton from '@material-ui/core/IconButton'
import { SyntheticEvent, useEffect, useState } from 'react'
import { ShareStationDesktop } from './ShareStationDesktop'
import { useMusicPlayer } from '../app/providers/MusicPlayerProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: 2
    },
    icon: {
      fontSize: ({ fontSize }: { fontSize: string | number }) => fontSize,
      color: theme.palette.primary.contrastText
    }
  })
)
export const ShareStationBtn = observer(function ShareStationBtn({
  fontSize
}: {
  fontSize: string | number
}) {
  const classes = useStyles({ fontSize })
  const player = useMusicPlayer()

  // dev - hardcoded for now
  const shareUrl = `http://localhost:3000/app?play=${player.station.id}`
  const shareTitle = 'Share Title'
  const shareText = 'Check this out'

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [showDesktopShare, setShowDesktopShare] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !navigator.share) {
      setShowDesktopShare(true)
    }
  }, [])

  const handleClick = (event: SyntheticEvent) => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      })
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {showDesktopShare ? (
        <ShareStationDesktop
          anchorEl={anchorEl}
          handleClose={handleClose}
          url={shareUrl}
          text="check this out"
        />
      ) : null}
      <Tooltip placement="top" title="Share station" aria-label="Share station">
        <IconButton
          onClick={handleClick}
          className={classes.button}
          size="medium"
        >
          <ShareIcon classes={{ root: classes.icon }} />
        </IconButton>
      </Tooltip>
    </>
  )
})
