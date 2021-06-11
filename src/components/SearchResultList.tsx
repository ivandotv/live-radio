import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactElement } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'

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

export const SearchResultList = observer(function SearchResultList({
  dataRow
}: {
  dataRow: (data: any) => (index: number) => ReactElement
}) {
  const classes = useStyles()
  const store = useFilterDataStore()

  return (
    <>
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
