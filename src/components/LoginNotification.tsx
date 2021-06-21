import { t } from '@lingui/macro'
import { Avatar } from '@material-ui/core'
import { useSession } from 'next-auth/client'
import { useSnackbar } from 'notistack'
import { useEffect, useRef } from 'react'

export default function LoginNotification() {
  const [session, loading] = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const notifShown = useRef(false)

  useEffect(() => {
    if (!loading && !notifShown.current) {
      notifShown.current = true

      enqueueSnackbar(
        session
          ? t`Signed in as ${session?.user.name}`
          : t`Signed in Anonymously`,
        {
          variant: 'info',
          // persist: true,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          },
          action: function customNotif() {
            return (
              <div>
                {/* <p>
                <Trans>Signed in as {session?.user.name}</Trans>
              </p> */}
                <Avatar
                  alt={session?.user.name ?? '?'}
                  src={session?.user.image as string}
                ></Avatar>
              </div>
            )
          }
        }
      )
    }
  }, [session, loading, enqueueSnackbar])

  return null
}
