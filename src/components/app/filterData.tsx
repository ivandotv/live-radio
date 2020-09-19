import TextField from '@material-ui/core/TextField'
import { useService } from '@xstate/react'
import { Interpreter } from 'xstate'
import {
  FilterRadioContext,
  // FilterRadioSchema,
  FilterRadioEvent
} from '../../lib/machines/filterRadioMachine'

export function FilterData({
  delay = 1000,
  className,
  filterService
}: {
  delay?: number
  className?: string
  filterService: Interpreter<FilterRadioContext, any, FilterRadioEvent>
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
