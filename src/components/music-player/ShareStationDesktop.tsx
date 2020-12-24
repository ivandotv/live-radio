import Fade from '@material-ui/core/Fade'
import Link from '@material-ui/core/Link'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { layout } from 'lib/appSettings'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useState } from 'react'

const twitterLink = (url: string, _text: string) =>
  `https://twitter.com/intent/tweet?url=${url}`

const fbLink = (url: string) =>
  `https://www.facebook.com/sharer/sharer.php?u=${url}`

const linkedInLink = (url: string, text: string) => `
http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(
  text
)}`

const stationSnackSuccess = 'Station link copied to clipboard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.text.primary,
      '&:hover': {
        textDecoration: 'none'
      }
    },
    snackbar: {
      bottom: `${layout.playerHeight + theme.spacing(2)}px`
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
  const [snackOpen, setSnackOpen] = useState(false)

  const handleClick = (_e: SyntheticEvent) => {
    handleClose()
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    handleClose()
    console.log('copied to clipboard')
    setSnackOpen(true)
  }

  const onSnackClose = (_: SyntheticEvent, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
  }

  const copyLinkItem =
    typeof window !== 'undefined' && navigator.clipboard ? (
      <MenuItem onClick={copyLink}>Copy link</MenuItem>
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

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackOpen}
        autoHideDuration={2500}
        onClose={onSnackClose}
        className={classes.snackbar}
      >
        <Alert severity="success">{stationSnackSuccess}</Alert>
      </Snackbar>
    </>
  )
})
