import { logger } from 'lib/client/logger-browser'
import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'

/* Note:
  If we run "handlerError" it will unmount the whole react tree
  and show a fallback component to reload the app
  TODO - filter which errors should force complete app reload
*/

export function WindowErrorHandler() {
  const handleError = useErrorHandler()

  useEffect(() => {
    const rejectionCb = (event: PromiseRejectionEvent) => {
      logger.warn('unhandled rejection', event)
      handleError(event)
    }

    const errorCb = (event: ErrorEvent) => {
      // ignore resize observer errors - (third party package - react virtuoso)
      if (event.message?.search(/resizeobserver/i) === -1) {
        logger.warn('unhandled error', event)
        handleError(event)
      }
    }

    window.addEventListener('unhandledrejection', rejectionCb)
    window.addEventListener('error', errorCb)

    return () => {
      window.removeEventListener('unhandledrejection', rejectionCb)
      window.removeEventListener('error', errorCb)
    }
  }, [handleError])

  return null
}
