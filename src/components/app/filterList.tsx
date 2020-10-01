import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import { Virtuoso } from 'react-virtuoso'
import { useFilterDataStore } from '../../components/app/providers/StoreProvider'
import { FilterInput } from './FilterInput'

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
  itemRow,
  // store,
  delay = 300
}: {
  itemRow: any
  // store: FilterDataStore
  delay?: number
}) {
  const classes = useStyles()
  const store = useFilterDataStore()

  return (
    <>
      <FilterInput className={classes.search} delay={delay} />
      {store.stations.length === 0 ? (
        <p className={classes.noResults}>No results</p>
      ) : (
        <div className={classes.scrollWrap}>
          <Virtuoso
            totalCount={store.stations.length}
            overscan={60}
            item={itemRow(store.stations)}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      )}
    </>
  )
})
