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
import { PlayerStatus } from 'lib/stores/music-player-store'
import { useClientUrl } from 'lib/utils/misc-utils'
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
    avatar: {
      marginInlineStart: theme.spacing(1),
      '&:hover': {
        cursor: 'pointer'
      }
    }
  })
)

export const UserProfileDropdown = observer(function UserProfileDropdown() {
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
    console.log({ session })
    console.log({ status })
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
        <MenuItem
          onClick={(e: React.MouseEvent<EventTarget>) => {
            router.push('/app/settings')
            handleClose(e)
          }}
          key="settings"
        >
          {t`Settings`}
        </MenuItem>
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
        </MenuItem>
      ]

  return (
    <div className={classes.avatarWrap}>
      {session?.user?.name ? <p>{session.user.name}</p> : <p>{t`Anonymous`}</p>}
      <div ref={anchorRef}>
        <Avatar
          alt={session?.user?.name ?? t`Anonymous`}
          className={classes.avatar}
          onClick={handleToggle}
          src={session?.user?.image as string}
        ></Avatar>
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
