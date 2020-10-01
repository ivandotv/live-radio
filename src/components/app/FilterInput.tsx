import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
// import { useFilterDataStore } from '../../stores/FilterDataStore'
import { useFilterDataStore } from '../../components/app/providers/StoreProvider'

export const FilterInput = observer(function FilterInput({
  delay = 200,
  className
}: // filterService
{
  delay?: number
  className?: string
  // filterService: Interpreter<FilterRadioContext, any, FilterRadioEvent>
  //   style?: React.CSSProperties
}) {
  // const [_, send] = useService(filterService)
  const store = useFilterDataStore()

  const searchRef = useRef<HTMLInputElement>(null)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.search(e.currentTarget.value, delay)
  }

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.log('interal')
  //     // send({ type: 'SEARCH' })
  //   }, 1000)

  //   return () => {
  //     clearInterval(id)
  //   }
  // })

  // useEffect(() => {
  //   if (service.context.query.length > 0) {
  //     // set query to url
  //     window.history.replaceState({}, '', `?filter=${service.context.query}`)
  //   } else {
  //     // remove query from url
  //     const url = new URL(window.location.href)
  //     url.searchParams.delete('filter')
  //     history.replaceState({}, '', url.href)
  //   }
  //   if (searchRef.current) {
  //     searchRef.current.value = store.query
  //   }
  // }, [store.query])
  // store.query

  if (searchRef.current) {
    searchRef.current.value = store.query
  }

  return (
    <TextField
      inputRef={searchRef}
      className={className}
      label="Filter"
      InputLabelProps={{ shrink: Boolean(store.query.length) }}
      onChange={handleSearch}
    />
  )
})
