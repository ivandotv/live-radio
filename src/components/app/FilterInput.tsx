import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
// import { useFilterDataStore } from '../../stores/FilterDataStore'
import { useFilterDataStore } from '../../components/app/providers/StoreProvider'

export const FilterInput = observer(function FilterInput({
  delay = 200,
  className,
  textPlaceHolder
}: // filterService
{
  delay?: number
  className?: string
  textPlaceHolder: string
  // filterService: Interpreter<FilterRadioContext, any, FilterRadioEvent>
  //   style?: React.CSSProperties
}) {
  // const [_, send] = useService(filterService)
  const store = useFilterDataStore()

  const searchRef = useRef<HTMLInputElement>(null)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.search(e.currentTarget.value, delay)
  }

  if (searchRef.current) {
    searchRef.current.value = store.query
  }

  console.log('label ', textPlaceHolder)

  return (
    <TextField
      inputRef={searchRef}
      className={className}
      label={textPlaceHolder}
      InputLabelProps={{ shrink: Boolean(store.query.length) }}
      onChange={handleSearch}
    />
  )
})
