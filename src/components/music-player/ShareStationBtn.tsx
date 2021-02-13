import ShareIcon from '@material-ui/icons/ShareOutlined'
import { t } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { observer } from 'mobx-react-lite'
import IconButton from '@material-ui/core/IconButton'
import { SyntheticEvent, useEffect, useState } from 'react'
import { ShareStationDesktop } from 'components/music-player/ShareStationDesktop'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { url } from 'app-config'

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
  const { musicPlayer } = useRootStore()

  const shareUrl = `${encodeURI(url)}/app?play=${encodeURIComponent(
    musicPlayer.station.id
  )}`
  const shareTitle = t`Share Station -- `
  const shareText = t`Check out this groovy station`

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
      <Tooltip
        placement="top"
        title={t`Share station`}
        aria-label={t`Share station`}
      >
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
