import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'
import { PageTitle } from '../PageTitle'
import { FilterInput } from './FilterInput'
import { FilterList } from './FilterList'
import { LocationBreadcrumbsWithResult } from './LocationBreadcrumbsWithResult'
import { useFilterDataStore } from './providers/StoreProvider'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    // paper: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   height: 'calc( 100vh - 182px )' // todo calculate the value dinamically
    // },
    noData: {
      margin: theme.spacing(2)
    },
    listSkeleton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      flex: 1
    },
    search: {
      margin: theme.spacing(2)
    }
  })
})

export const BrowseBy = observer(function BrowserBy({
  noData,
  dataRow,
  breadcrumbs,
  title,
  filterInputText,
  showFallback = () => false
}: {
  noData?: ReactNode
  dataRow: (data: any) => (index: number) => ReactElement
  // dataRow: (index: number) => ReactElement
  breadcrumbs: { href?: string; text: string }[]
  title: string
  filterInputText: string
  showFallback?: () => boolean
}) {
  const classes = useStyles()
  const store = useFilterDataStore()
  const router = useRouter()
  const delay = 300

  console.log('browse by')

  useEffect(() => {
    // initial query can come from the router
    if (router.query?.filter?.length) {
      const query = (router.query.filter as string).replace(/\+/g, ' ')
      store.search(query)
    }
  }, [router, store])

  if (router.isFallback || showFallback()) {
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.search(e.currentTarget.value, delay)
  }

  return (
    <>
      <LocationBreadcrumbsWithResult
        links={breadcrumbs}
        results={store.filtered}
      />
      {store.allData.length ? (
        <>
          <FilterInput
            textPlaceHolder={filterInputText}
            className={classes.search}
            // delay={delay}
            query={store.query}
            handleOnChange={handleOnChange}
          />
          <FilterList dataRow={dataRow} data={store.filtered} />
        </>
      ) : (
        <div className={classes.noData}>{noData || null}</div>
      )}
    </>
  )
})
