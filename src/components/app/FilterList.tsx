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

  /* Working with the history directly, it is a lot easier
    then using router ( less rendering)
 */
  useEffect(
    () =>
      reaction(
        () => {
          return store.query
        },
        (query: string) => {
          if (query.length) {
            /*
            If there is something in the history, check
             */
            if (!store.fromHistory) {
              const filter = query.replace(/\s/g, '+')
              window.history.pushState({ filter }, '', `?filter=${filter}`)
              console.log('historys stack: ', window.history)
            } else {
              console.log('store history NOT empty -do not PUSH')
              store.fromHistory = false
            }
          } else {
            // case when filter is empty ?filter=''
            const url = new URL(window.location.href)
            url.searchParams.delete('filter')
            history.pushState({}, '', url.href)
          }
        }
      ),
    [store]
  )
  useEffect(() => {
    // initial query comes from the router
    if (router.query?.filter?.length) {
      const query = (router.query.filter as string).replace(/\+/g, ' ')
      store.search(query)
    }

    const onPopState = (e: PopStateEvent) => {
      console.log('pop state')
      console.log(e.state)
      // if (data.state?.data) {
      //   setState(data.state.data)
      // }
      // if (e.state.filter) {
      store.fromHistory = true
      store.search(e.state.filter ? e.state.filter : '')
      // }
    }
    window.addEventListener('popstate', onPopState)

    return () => {
      store.fromHistory = false
      window.removeEventListener('popstate', onPopState)
    }
  }, [router, store])

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
