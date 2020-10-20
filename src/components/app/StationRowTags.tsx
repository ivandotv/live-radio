import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { RadioStation } from '../../types'
import { useFilterDataStore } from './providers/StoreProvider'
import { TagList } from './TagList'

export const StationRowTags = observer(function StationRowTags({
  station
}: {
  station: RadioStation
}) {
  const store = useFilterDataStore()

  const tagClick = useCallback(
    (tag: string) => {
      store.search(store.query.length ? `${store.query} ${tag}` : `${tag}`, 0)
    },
    [store]
  )

  return <TagList tags={station.tags} onTagClick={tagClick} />
})