import ListItem from '@material-ui/core/ListItem'
import { TagList } from './TagList'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'
import Button from '@material-ui/core/Button'
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
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { useMusicPlayerStore } from './providers/MusicPlayerProvider'

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
  noData
}: // itemRow
{
  title: string
  breadcrumbs: { href?: string; text: string }[]
  noData: ReactNode
}) {
  const classes = useStyles()
  const router = useRouter()
  const store = useFilterDataStore()
  const player = useMusicPlayerStore()

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

  const sendQuery = (query: string, delay?: number) => {
    store.search(query, delay)
  }

  const row = function (stations: RadioStation[]) {
    return function ListRow(index: number) {
      const station = stations[index]

      return (
        <ListItem divider key={station.uuid}>
          <ListItemText>
            <Button
              onClick={() => {
                console.log(station.url)
                // todo - wrap in playerStore.togglePlay
                if (player.stationUUID === station.uuid) {
                  // this station is already selected
                  if (player.status === PlayerStatus.PLAYING) {
                    player.pause()
                    // check if its playing our station
                  } else if (player.status === PlayerStatus.STOPPED) {
                    player.play(station)
                  } else if (player.status === PlayerStatus.PAUSED) {
                    player.resume()
                  }
                } else {
                  player.play(station)
                }
              }}
              startIcon={<PlayPauseBtn uuid={station.uuid} />}
            >
              {`${station.name} | ${station.country}`}
            </Button>
            <TagList
              tags={station.tags}
              onTagClick={(tag) => {
                sendQuery(
                  store.query.length ? `${store.query} ${tag}` : `${tag}`,
                  0
                )
              }}
            />
          </ListItemText>
        </ListItem>
      )
    }
  }

  // add result count at the end of the last breadcrumb
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1]

  lastCrumb.text = lastCrumb.text = `${lastCrumb.text.replace(/\(.+\)/, '')} (${
    store.filtered.length
  } ${store.filtered.length === 1 ? 'result' : 'results'}) `

  breadcrumbs[breadcrumbs.length - 1] = lastCrumb

  return (
    <Paper className={classes.paper}>
      <PageTitle title={title} />
      <LocationBreadCrumbs links={[...breadcrumbs]} />
      {/* todo - special component just for the results */}
      {store.allData.length === 0 ? (
        <div className={classes.noData}>{noData}</div>
      ) : (
        <>
          <FilterList store={store} itemRow={row}></FilterList>
        </>
      )}
    </Paper>
  )
})
