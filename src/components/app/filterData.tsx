import TextField from '@material-ui/core/TextField'
import { useService } from '@xstate/react'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Interpreter } from 'xstate'
// eslint-disable-next-line
export const FilterData = forwardRef(
  (
    {
      delay = 1000,
      cb,
      className,
      searchService
    }: {
      cb: (v: string) => void
      delay?: number
      className?: string
      searchService: Interpreter
    },
    ref
  ) => {
    // const [searchValue, setSearch] = useState('')

    const [state, send] = useService(searchService)
    console.log('use service', state)
    // let ignoreCb = false
    // const [ignoreCb, setIgnoreCb] = useState(false)
    // useImperativeHandle(ref, () => {
    //   return (s: string) => {
    //     // ignoreCb = true
    //     setIgnoreCb(true)
    //     setSearch(s)
    //     cb(s)
    //   }
    // })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value
      // setIgnoreCb(false)
      // setSearch(newValue)
      // cb(newValue)
      console.log('filter: on change ', newValue)
      console.log('state machine state', state.value)

      send({ type: 'SEARCH', query: newValue })
    }

    // useEffect(() => {
    //   const id = setTimeout(() => {
    //     if (!ignoreCb) {
    //       cb(searchValue)
    //     }
    //   }, delay)

    //   return () => {
    //     clearTimeout(id)
    //   }
    // }, [searchValue, cb, delay, ignoreCb])

    // console.log('====== ', searchService)

    return (
      <>
        <p>interpreter {searchService.machine.context.testData}</p>
        <TextField
          className={className}
          label="Filter"
          value={state.context.query}
          onChange={handleSearch}
          // inputRef={ref}
        />
      </>
    )
  }
)
