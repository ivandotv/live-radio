import TextField from '@material-ui/core/TextField'
import { useService } from '@xstate/react'
import { Interpreter } from 'xstate'

export function FilterData({
  delay = 1000,
  className,
  filterService
}: {
  delay?: number
  className?: string
  filterService: Interpreter
}) {
  const [service, send] = useService(filterService)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CANCEL' })
    send({ type: 'SEARCH', query: e.currentTarget.value, delay: delay })
  }

  return (
    <TextField
      className={className}
      label="Filter"
      value={service.context.query}
      onChange={handleSearch}
    />
  )
}
