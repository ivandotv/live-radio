import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'

export const FilterInput = observer(function FilterInput({
  // delay = 200,
  className,
  textPlaceHolder,
  query,
  handleOnChange
}: // filterService
{
  // delay?: number
  className?: string
  textPlaceHolder: string
  query: string
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  // filterService: Interpreter<FilterRadioContext, any, FilterRadioEvent>
  //   style?: React.CSSProperties
}) {
  // const [_, send] = useService(filterService)
  // const store = useFilterDataStore()

  const searchRef = useRef<HTMLInputElement>(null)
  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   store.search(e.currentTarget.value, delay)
  // }

  console.log('filter input query ', query)
  if (searchRef.current) {
    // searchRef.current.value = store.query
    searchRef.current.value = query
  }

  return (
    <TextField
      inputRef={searchRef}
      defaultValue={query}
      className={className}
      label={textPlaceHolder}
      // InputLabelProps={{ shrink: Boolean(store.query.length) }}
      InputLabelProps={{ shrink: Boolean(query.length) }}
      onChange={handleOnChange}
    />
  )
})
