import { observer } from 'mobx-react-lite'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Paper from '@material-ui/core/Paper'
import { ListData } from './ListData'
import { useFilterDataStore } from './providers/StoreProvider'
import { PageTitle } from '../PageTitle'
import { LocationBreadcrumbsWithResult } from './LocationBreadcrumbsWithResult'
import { ReactElement, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FilterList } from './FilterList'
import { reaction } from 'mobx'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 72px )' // todo calculate the value dinamically
    },
    noData: {
      margin: theme.spacing(2)
    },
    listSkeleton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      flex: 1
    }
  })
})

export const BrowseBy = observer(function BrowserBy({
  noData,
  dataRow,
  breadcrumbs,
  title
}: {
  noData?: ReactNode
  dataRow: (data: any) => (index: number) => ReactElement
  // dataRow: (index: number) => ReactElement
  breadcrumbs: { href?: string; text: string }[]
  title: string
}) {
  const classes = useStyles()
  const store = useFilterDataStore()
  const router = useRouter()

  console.log('browse by')

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
              // window.history.replaceState({ filter }, '', `?filter=${filter}`)
              // router.push(
              //   { pathname: router.pathname, query: { filter } },
              //   undefined,
              //   { shallow: true }
              // )
              console.log('router')
              console.log(router)
            } else {
              store.fromHistory = false
            }
          } else {
            // case when filter is empty ?filter=''
            const url = new URL(window.location.href)
            url.searchParams.delete('filter')
            if (!store.fromHistory) {
              history.replaceState({}, '', url.href)
            } else {
              store.fromHistory = false
            }
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

  if (router.isFallback) {
    return (
      <Paper className={classes.paper}>
        {new Array(5).fill(1).map((_, i) => (
          <Skeleton
            component="div"
            className={classes.listSkeleton}
            variant="rect"
            key={i}
            animation="wave"
          />
        ))}
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper}>
      <PageTitle title={title} />
      <LocationBreadcrumbsWithResult links={breadcrumbs} store={store} />
      {store.allData.length ? (
        <FilterList dataRow={dataRow} />
      ) : (
        <div className={classes.noData}>{noData || null}</div>
      )}
    </Paper>
  )
})
