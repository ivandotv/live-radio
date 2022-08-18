import { t } from '@lingui/macro'
import {
  Avatar,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import { useClientUrl } from 'lib/client/hooks'
import { logger } from 'lib/client/logger-browser'
import { PlayerStatus } from 'lib/client/stores/music-player-store'
import { observer } from 'mobx-react-lite'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useRootStore } from './providers/RootStoreProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    dropdownWrap: {
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    avatar: {
      marginInlineStart: theme.spacing(1),
      '&:hover': {
        cursor: 'pointer'
      }
    },
    username: {
      userSelect: 'none'
    }
  })
)

// TODO - setup settings page

// function SettingsItem({
//   handleClose
// }: {
//   handleClose: (event: React.MouseEvent<EventTarget>) => void
// }) {
//   const router = useRouter()

//   return (
//     <MenuItem
//       onClick={(e: React.MouseEvent<EventTarget>) => {
//         router.push('/app/settings')
//         handleClose(e)
//       }}
//     >
//       {t`Settings`}
//     </MenuItem>
//   )
// }

function AboutItem({
  handleClose,
  handleOpenAppModal
}: {
  handleClose: (event: React.MouseEvent<EventTarget>) => void
  handleOpenAppModal: () => void
}) {
  return (
    <MenuItem
      onClick={(e: React.MouseEvent<EventTarget>) => {
        // router.push('/app/about')
        handleClose(e)
        handleOpenAppModal()
      }}
    >
      {t`About`}
    </MenuItem>
  )
}

export const UserProfileDropdown = observer(function UserProfileDropdown({
  handleOpenAppModal
}: {
  handleOpenAppModal: () => void
}) {
  const { data: session, status } = useSession()
  const classes = useStyles()
  const router = useRouter()
  const { musicPlayer } = useRootStore()

  const [open, setOpen] = useState(false)

  const anchorRef = useRef<HTMLDivElement>(null)

  const callbackUrl = useClientUrl(`/${router.locale}${router.asPath}`)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  useEffect(() => {
    logger.log({ session })
    logger.log({ status })
  }, [session, status])

  const menuItems = session
    ? [
        <MenuItem
          onClick={(e: React.MouseEvent<EventTarget>) => {
            signOut({ callbackUrl: '/' })
            handleClose(e)
          }}
          key="signout"
        >
          {t`Sign out`}
        </MenuItem>,
        // <SettingsItem key="settings" handleClose={handleClose} />,
        <AboutItem
          key="about"
          handleClose={handleClose}
          handleOpenAppModal={handleOpenAppModal}
        />
      ]
    : [
        <MenuItem
          onClick={(e: React.MouseEvent<EventTarget>) => {
            handleClose(e)
            if (
              musicPlayer.status === PlayerStatus.PLAYING ||
              musicPlayer.status === PlayerStatus.BUFFERING
            ) {
              sessionStorage.setItem('signInInterrupt', '1')
            }
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
          }}
          key="signin"
        >
          {t`Sign in`}
        </MenuItem>,
        // <SettingsItem key="settings" handleClose={handleClose} />,
        <AboutItem
          key="about"
          handleClose={handleClose}
          handleOpenAppModal={handleOpenAppModal}
        />
      ]

  if (status === 'loading') return null

  return (
    <div className={classes.avatarWrap}>
      {/* <Typography className={classes.username}>
        {session?.user?.name ? session.user.name : t`Anonymous`}
      </Typography> */}
      <div onClick={handleToggle} className={classes.dropdownWrap}>
        <div ref={anchorRef}>
          <Avatar
            alt={session?.user?.name ?? t`Anonymous`}
            className={classes.avatar}
            src={session?.user?.image as string}
          ></Avatar>
        </div>
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </div>
      <div>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>{menuItems}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
})
