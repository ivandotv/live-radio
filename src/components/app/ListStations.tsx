import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useFilterDataStore } from '../../components/app/providers/StoreProvider'
import { PageTitle } from '../PageTitle'
import { FilterList } from './FilterList'
import { LocationBreadCrumbs } from './LocationBreadCrumbs'

export type RadioStation = {
  tags: string[]
  name: string
  uuid: string
  url: string
  favicon: string
  homepage: string
  country: string
  language: string[]
  continent: string
  codec: string
}
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
export const ListStations = observer(function ListStations({
  title,
  breadcrumbs,
  noData,
  primary,
  secondary
}: {
  title: string
  breadcrumbs: { href?: string; text: string }[]
  noData: ReactNode
  primary: (
    station: RadioStation,
    query: string,
    sendQuery: (query: string, delay: number) => void
  ) => React.ReactNode
  secondary: (
    station: RadioStation,
    query: string,
    sendQuery: (query: string, delay: number) => void
  ) => React.ReactNode
  // stations: RadioStation[]
}) {
  const classes = useStyles()
  const router = useRouter()
  const store = useFilterDataStore()

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

  const sendQuery = (query: string) => {
    store.search(query)
  }

  const listRow = function (stations: RadioStation[]) {
    return function ListRow(index: number) {
      const station = stations[index]

      return (
        <ListItem divider key={station.uuid}>
          <ListItemText
            primary={primary(station, store.query, sendQuery)}
            secondary={secondary(station, store.query, sendQuery)}
          />
        </ListItem>
      )
    }
  }

  // add result count at the end of the last breadcrumb
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1]

  lastCrumb.text = lastCrumb.text = `${lastCrumb.text.replace(/\(.+\)/, '')} (${
    store.stations.length
  } ${store.stations.length === 1 ? 'result' : 'results'}) `

  breadcrumbs[breadcrumbs.length - 1] = lastCrumb

  return (
    <Paper className={classes.paper}>
      <PageTitle title={title} />
      <LocationBreadCrumbs links={[...breadcrumbs]} />
      {store.allStations.length === 0 ? (
        <div className={classes.noData}>{noData}</div>
      ) : (
        <>
          {/* <FilterInput className={''} filterService={service} /> */}
          <FilterList itemRow={listRow}></FilterList>
        </>
      )}
    </Paper>
  )
})
