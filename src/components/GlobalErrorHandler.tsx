import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'

export default function GlobalErrorHandler() {
  const handleError = useErrorHandler()
  useEffect(() => {
    // window.addEventListener('unhandledrejection', (event) => {
    //   handleError(event)
    // })
    // window.addEventListener('error', (event) => {
    //   handleError(event)
    // })
  }, [handleError])

  return null
}
