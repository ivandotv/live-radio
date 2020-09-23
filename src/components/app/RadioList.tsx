import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { useMachine } from '@xstate/react'
import { useRouter } from 'next/router'
import { useEffect, useState, useLayoutEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import {
  FilterRadioContext,
  FilterRadioEvent,
  // FilterRadioSchema
  // FinalEvents
  filterRadioMachine
} from '../../lib/machines/filterRadioMachine'
import { PageTitle } from '../pageTitle'
import { FilterData } from './filterData'
import { LocationBreadCrumbs } from './locationBreadCrumbs'
import { TagList } from './tagList'

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
}
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 72px )' // todo calculate the value dinamically
    },
    scrollWrap: {
      position: 'relative',
      height: '99%'
    },
    search: {
      margin: theme.spacing(2)
    },
    noData: {
      margin: theme.spacing(2)
    },
    breadcrumbsSkeleton: {
      margin: theme.spacing(2),
      height: '1.7rem'
    },
    listSkeleton: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      flex: 1
    },
    virtualList: {
      height: 'calc( 100vh - 72px )' // todo calculate the value dinamically
    }
  })
})
export function RadioList({
  title,
  breadcrumbs,
  noResults,
  stations,
  rowPrimary
}: {
  title: string
  breadcrumbs: { href?: string; text: string }[]
  noResults: string
  rowPrimary: (station: RadioStation) => React.ReactNode
  stations: RadioStation[]
}) {
  const classes = useStyles()
  const router = useRouter()
  const [showIt, setShowIt] = useState(false)

  const [machine, send, service] = useMachine<
    FilterRadioContext,
    FilterRadioEvent
  >(filterRadioMachine)
  service.start()

  useLayoutEffect(() => {
    if (stations) {
      send({ type: 'POPULATE_STATIONS', stations })
    }
  }, [send, stations])

  useEffect(() => {
    // console.log('fallback ', router.isFallback)
    // console.log('genre ', router.query.genre)
    // console.log('filter ', router.query.filter)

    if (!router.isFallback) {
      if (router.query.genre && router.query.filter) {
        send({ type: 'SEARCH', query: router.query.filter as string, delay: 0 })
      }
      setShowIt(true)
    }
  }, [router, send])

  if (router.isFallback) {
    return (
      <Paper className={classes.paper}>
        <Skeleton
          component="div"
          className={classes.breadcrumbsSkeleton}
          variant="rect"
        />
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

  const handleTagClick = (tag: string) => {
    // send({ type: 'CANCEL' })
    send({ type: 'SEARCH', query: `${machine.context.query} ${tag}`, delay: 0 })
  }

  const stationListData: RadioStation[] = machine.context.filteredStations

  const listRow = function (index: number) {
    const station = stationListData[index]

    return (
      <ListItem divider button key={station.uuid}>
        <ListItemText
          primary={rowPrimary(station)}
          secondary={
            <TagList tags={station.tags} onTagClick={handleTagClick} />
          }
        />
      </ListItem>
    )
  }

  // add result count at the end of the last breadcrumb
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1]

  lastCrumb.text = lastCrumb.text = `${lastCrumb.text.replace(/\(.+\)/, '')} (${
    stationListData.length
  } ${stationListData.length === 1 ? 'result' : 'results'}) `

  breadcrumbs[breadcrumbs.length - 1] = lastCrumb

  return (
    <Paper className={classes.paper}>
      <PageTitle title={title} />
      <LocationBreadCrumbs links={[...breadcrumbs]} />
      {machine.context.allStations.length === 0 ? (
        <div className={classes.noData}>
          <p>{noResults}</p>
        </div>
      ) : (
        <>
          <FilterData
            style={{ opacity: showIt ? 1 : 0 }}
            className={classes.search}
            delay={200} // debounce typing
            filterService={service}
          />
          {machine.context.filteredStations.length === 0 ? (
            <h1>no filter data</h1>
          ) : (
            <div
              style={{ opacity: showIt ? 1 : 0 }}
              className={classes.scrollWrap}
            >
              <Virtuoso
                totalCount={stationListData.length}
                overscan={60}
                item={listRow}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          )}
        </>
      )}
    </Paper>
  )
}
