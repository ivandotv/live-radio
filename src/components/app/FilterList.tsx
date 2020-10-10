import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { reaction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useFilterDataStore } from './providers/StoreProvider'
import { FilterInput } from './FilterInput'
import { FilterDataStore } from '../../lib/stores/FilterDataStore'
import { StationRowItem } from './StationRowItem'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    scrollWrap: {
      position: 'relative',
      height: '99%'
    },
    search: {
      margin: theme.spacing(2)
    },
    noResults: {
      margin: theme.spacing(2)
    }
  })
})
export const FilterList = observer(function FilterList({
  dataRow,
  delay = 300
}: // store
{
  dataRow: (data: any) => (index: number) => ReactElement
  // dataRow: (index: number) => ReactElement
  delay?: number
  // store: FilterDataStore
}) {
  const classes = useStyles()
  const router = useRouter()
  const store = useFilterDataStore()

  return (
    <>
      <FilterInput className={classes.search} delay={delay} />
      {store.filtered.length === 0 ? (
        <p className={classes.noResults}>No results</p>
      ) : (
        <div className={classes.scrollWrap}>
          <Virtuoso
            totalCount={toJS(store.filtered.length)}
            overscan={40}
            item={dataRow(toJS(store.filtered))}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      )}
    </>
  )
})
