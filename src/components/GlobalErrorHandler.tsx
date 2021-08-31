import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'

export default function GlobalErrorHandler() {
  const handleError = useErrorHandler()
  useEffect(() => {
    window.addEventListener('unhandledrejection', (event) => {
      // handleError(event)
      console.log('unhandledrejection', event)
      //todo - log to third party
    })
    window.addEventListener('error', (_event) => {
      // handleError(event)
      // console.log('error', event)
      //todo - log to third party
    })
  }, [handleError])

  return null
}
