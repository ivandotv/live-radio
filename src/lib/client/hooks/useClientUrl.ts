import { useEffect, useState } from 'react'

export function useClientUrl(path = '') {
  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(`${window.location.origin.replace(/\/$/, '')}${path}`)
  }, [path])

  return url
}
