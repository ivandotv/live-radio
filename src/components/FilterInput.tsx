import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'

export const FilterInput = observer(function FilterInput({
  className,
  textPlaceHolder = 'Search Stations:D ',
  query,
  handleOnChange
}: {
  className?: string
  textPlaceHolder: string
  query: string
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = query
    }
  }, [query])

  return (
    <TextField
      inputRef={searchRef}
      defaultValue={query}
      className={className}
      label={textPlaceHolder}
      InputLabelProps={{ shrink: Boolean(query.length) }}
      onChange={handleOnChange}
    />
  )
})
