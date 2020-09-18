import TextField from '@material-ui/core/TextField'
import { useService } from '@xstate/react'
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react'
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
    const [searchValue, setSearch] = useState('')

    const [state, send] = useService(searchService)
    // console.log('use service', state)
    const searchInput = useRef(null)
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
      // // cb(newValue)
      console.log('filter: on change ', newValue)
      // console.log('state machine state', state.value)

      send({ type: 'CANCEL' })
      send({ type: 'SEARCH', query: newValue, delay: 3000 })
    }

    // useEffect(() => {
    //   const id = setTimeout(() => {
    //     console.log('use effect ', searchInput.current.value)
    //     send({ type: 'SEARCH', query: searchInput.current.value })
    //   }, delay)

    //   return () => {
    //     clearTimeout(id)
    //   }
    // }, [searchValue, delay, send])

    return (
      <TextField
        className={className}
        label="Filter"
        value={state.context.query}
        inputRef={searchInput}
        onChange={handleSearch}
      />
    )
  }
)
