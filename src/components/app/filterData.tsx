import * as JsSearch from 'js-search'
import TextField from '@material-ui/core/TextField'
import { useState, useEffect } from 'react'
export function FilterData({
  delay = 1000,
  cb
}: {
  cb: (v: string) => void
  delay?: number
}) {
  const [searchValue, setSearch] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setSearch(newValue)
    // cb(newValue)
  }
  console.log('search value ', searchValue)

  useEffect(() => {
    const id = setTimeout(() => {
      console.log('update state child')
      cb(searchValue)
    }, delay)

    // this will clear Timeout when component unmount like in willComponentUnmount
    return () => {
      clearTimeout(id)
    }
  }, [searchValue, cb, delay])

  return (
    <TextField
      classes={
        {
          // root: classes.search
        }
      }
      label="Filter"
      value={searchValue}
      onChange={handleSearch}
    />
  )
}
