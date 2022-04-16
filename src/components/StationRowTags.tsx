import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { TagList } from 'components/TagList'
import { RadioModel } from 'lib/client/radio-model'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

export const StationRowTags = observer(function StationRowTags({
  station,
  className
}: {
  station: RadioModel
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
      <TagList tags={station.data.tags} onTagClick={tagClick} />
    </span>
  )
})
