import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useFilterDataStore } from './providers/StoreProvider'
import { FilterInput } from './FilterInput'
import { FilterDataStore } from '../../lib/stores/FilterDataStore'

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
  delay = 300,
  store
}: {
  itemRow: any
  delay?: number
  store: FilterDataStore
}) {
  const classes = useStyles()
  // const store = useFilterDataStore()
  const router = useRouter()

  useEffect(
    () =>
      reaction(
        () => {
          console.log('effect -> reaction')

          return store.query
        },
        (query: string) => {
          if (query.length) {
            window.history.replaceState(
              {},
              '',
              `?filter=${query.replace(/\s/g, '+')}`
            )
          } else {
            const url = new URL(window.location.href)
            url.searchParams.delete('filter')
            history.replaceState({}, '', url.href)
          }
        }
      ),
    [store]
  )
  useEffect(() => {
    console.log('router query: ', router.query)
    console.log(' window location: ', window.location.href)

    if (router.query && router.query.filter && router.query.filter.length) {
      const query = (router.query.filter as string).replace(/\+/g, ' ')
      store.search(query)
    }
  }, [router, store])

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
