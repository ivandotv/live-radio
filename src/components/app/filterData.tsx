import TextField from '@material-ui/core/TextField'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
// eslint-disable-next-line
export const FilterData = forwardRef(
  (
    {
      delay = 1000,
      cb,
      className
    }: {
      cb: (v: string) => void
      delay?: number
      className?: string
    },
    ref
  ) => {
    const [searchValue, setSearch] = useState('')

    // let ignoreCb = false
    const [ignoreCb, setIgnoreCb] = useState(false)
    useImperativeHandle(ref, () => {
      return (s: string) => {
        // ignoreCb = true
        setIgnoreCb(true)
        setSearch(s)
        cb(s)
      }
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value
      setIgnoreCb(false)
      setSearch(newValue)
      // cb(newValue)
    }

    useEffect(() => {
      const id = setTimeout(() => {
        if (!ignoreCb) {
          cb(searchValue)
        }
      }, delay)

      return () => {
        clearTimeout(id)
      }
    }, [searchValue, cb, delay, ignoreCb])

    return (
      <TextField
        className={className}
        label="Filter"
        value={searchValue}
        onChange={handleSearch}
        // inputRef={ref}
      />
    )
  }
)
