import { t } from '@lingui/macro'
import Cookies from 'js-cookie'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export function AppUpdatedNotification({ cookieName }: { cookieName: string }) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (Cookies.get(cookieName)) {
      Cookies.remove(cookieName)
      enqueueSnackbar(t`Application updated`, {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
    }
  }, [cookieName, enqueueSnackbar])

  return null
}
