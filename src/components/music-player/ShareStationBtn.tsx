import ShareIcon from '@material-ui/icons/ShareOutlined'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { observer } from 'mobx-react-lite'
import IconButton from '@material-ui/core/IconButton'
import { SyntheticEvent, useEffect, useState } from 'react'
import { ShareStationDesktop } from 'components/music-player/ShareStationDesktop'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { AppSettings } from 'lib/appSettings'

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

  const { url, name, id } = player.station

  const queryParams = `?play=${encodeURI(url)}&name=${encodeURIComponent(
    name
  )}&id=${encodeURIComponent(id)}`

  // twitter needs additional keys to also be encoded
  const twitterQueryParams = `?play=${encodeURI(url)}${encodeURIComponent(
    `&name=${name}&id=${id}`
  )}`

  const shareUrl = `${AppSettings.url}/app${queryParams}`
  const twitterShareUrl = `${AppSettings.url}/app${twitterQueryParams}`

  const shareTitle = 'Share Station'
  const shareText = 'Check out this groovy station'

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
          twitterUrl={twitterShareUrl}
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
