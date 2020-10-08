import { observer } from 'mobx-react-lite'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Paper from '@material-ui/core/Paper'
import { ListData } from './ListData'
import { useFilterDataStore } from './providers/StoreProvider'
import { PageTitle } from '../PageTitle'
import { LocationBreadcrumbsWithResult } from './LocationBreadcrumbsWithResult'
import { ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { FilterList } from './FilterList'

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
