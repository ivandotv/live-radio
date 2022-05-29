import { t } from '@lingui/macro'
import Fade from '@material-ui/core/Fade'
import Link from '@material-ui/core/Link'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { SHARED_CONFIG } from 'lib/shared/config'
import { logger } from 'lib/client/logger-browser'
import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'
import { SyntheticEvent } from 'react'

const twitterLink = (url: string, _text: string) =>
  `https://twitter.com/intent/tweet?url=${url}`

const fbLink = (url: string) =>
  `https://www.facebook.com/sharer/sharer.php?u=${url}`

const linkedInLink = (url: string, text: string) => `
 https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent(
  text
)}`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.text.primary,
      '&:hover': {
        textDecoration: 'none'
      }
    },
    snackbar: {
      bottom: `${SHARED_CONFIG.layout.playerHeight + theme.spacing(2)}px`
    }
  })
)

export const ShareStationDesktop = observer(function ShareStationDesktop({
  anchorEl,
  handleClose,
  url,
  text
}: {
  anchorEl: Element | null
  handleClose: () => void
  url: string
  text: string
}) {
  const classes = useStyles()

  const handleClick = (_e: SyntheticEvent) => {
    handleClose()
  }

  const { enqueueSnackbar } = useSnackbar()

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    handleClose()
    enqueueSnackbar(t`Station link copied to clipboard`, {
      variant: 'success',
      className: classes.snackbar,
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
      }
    })

    logger.log('copied to clipboard')
  }

  const copyLinkItem =
    typeof window !== 'undefined' && navigator.clipboard ? (
      <MenuItem onClick={copyLink}>{t`Copy link`}</MenuItem>
    ) : null

  return (
    <>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClick}>
          <Link
            className={classes.link}
            href={twitterLink(url, text)}
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClick}>
          <Link
            className={classes.link}
            href={fbLink(url)}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClick}>
          <Link
            className={classes.link}
            href={linkedInLink(url, text)}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </Link>
        </MenuItem>
        {copyLinkItem}
      </Menu>
    </>
  )
})
