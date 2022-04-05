import { logger } from 'lib/logger-browser'
import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'

/* Note:
  If we run "handlerError" it will unmount the whole react tree
  and show a fallback component to reload the app
  TODO - filter which errors should force complete app reload
  TODO - log errors
*/
export function WindowErrorHandler() {
  const handleError = useErrorHandler()

  useEffect(() => {
    window.addEventListener('unhandledrejection', (_event) => {
      // handleError(event)
      logger.warn('unhandledrejection', _event)
    })
    window.addEventListener('error', (_event) => {
      // handleError(event)
      logger.warn(_event)
    })
  }, [handleError])

  return null
}
