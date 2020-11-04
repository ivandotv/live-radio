import { useState, useEffect } from 'react'
export function useFetch<TData>(
  url: string,
  options?: RequestInit
): { data: TData | null; error: Error | null } {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options)
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          const errText = await res.text()
          throw new Error(errText)
        }
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [url, options])

  return { data, error }
}
