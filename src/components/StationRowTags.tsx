import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { RadioStation } from 'types'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { TagList } from 'components/TagList'

export const StationRowTags = observer(function StationRowTags({
  station,
  className
}: {
  station: RadioStation
  className?: string
}) {
  const store = useFilterDataStore()

  const tagClick = useCallback(
    (tag: string) => {
      store.search(store.query.length ? `${store.query} ${tag}` : `${tag}`, 0)
    },
    [store]
  )

  return (
    <span className={className}>
      <TagList tags={station.tags} onTagClick={tagClick} />
    </span>
  )
})
