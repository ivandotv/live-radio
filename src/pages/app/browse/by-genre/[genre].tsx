import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { useMachine } from '@xstate/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { FilterData } from '../../../../components/app/filterData'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { LocationBreadCrumbs } from '../../../../components/app/locationBreadCrumbs'
import { TagList } from '../../../../components/app/tagList'
import { PageTitle } from '../../../../components/pageTitle'
import {
  FilterRadioContext,
  filterRadioMachine,
  FinalEvents
} from '../../../../lib/machines/filterRadioMachine'
import { RadioStation } from '../by-location/[continent]/country/[country]'

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    // todo - add most popular genres
    paths: [{ params: { genre: 'pop' } }],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  console.log('genre get static props', ctx)

  const genre = (ctx.params?.genre as string).replace('-', ' ')

  const api = new RadioBrowserApi('radio-next', fetch)
  const stations = await api.searchStations({
    tag: genre,
    limit: 1000
  })

  const leanStations = []
  // strip properties that are not in use
  for (const station of stations) {
    leanStations.push({
      tags: [...new Set(station.tags.split(','))],
      name: station.name,
      url: station.url_resolved,
      uuid: station.stationuuid,
      favicon: station.favicon,
      homepage: station.homepage,
      country: station.country,
      language: station.language.split(',')
    })
  }

  return {
    props: {
      stations: leanStations,
      genre: genre
    },
    revalidate: 600 // 10 minutes
  }
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
      height: '100%'
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
    }
  })
})

export default function GenreStations({
  stations,
  genre
}: {
  stations: RadioStation[]
  genre: string
}) {
  const classes = useStyles()
  const router = useRouter()

  const [current, send, service] = useMachine<
    FilterRadioContext,
    // FilterRadioSchema,
    FinalEvents
  >(filterRadioMachine)
  service.start()

  useEffect(() => {
    if (stations) {
      send('POPULATE_STATIONS', { stations })
    }
  }, [send, stations])

  if (router.isFallback) {
    // const skeletonList = []
    return (
      <Paper className={classes.paper}>
        {/* <CircularProgress /> */}
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
        {/* {skeletonList} */}
      </Paper>
    )
  }

  const handleTagClick = (tag: string) => {
    send({ type: 'SEARCH', query: `${current.context.query} ${tag}`, delay: 0 })
  }

  const stationListData: RadioStation[] = current.context.stations

  const breadcrumbLinks = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-genre',
      text: 'By Genre'
    },
    {
      text: `${genre} ( ${stationListData.length} results )`
    }
  ]

  const listRow = function (index: number) {
    const station = stationListData[index]

    return (
      <ListItem divider button key={station.uuid}>
        <ListItemText
          primary={`${station.name} | ${station.country}`}
          secondary={
            <TagList tags={station.tags} onTagClick={handleTagClick} />
          }
        />
      </ListItem>
    )
  }

  return (
    <Paper className={classes.paper}>
      <PageTitle title={`Browse For Stations in ${genre}`} />
      <LocationBreadCrumbs links={breadcrumbLinks} />
      {current.context.allStations.length === 0 ? (
        <div className={classes.noData}>
          <p>
            Currently there is no data for {genre}. Sorry for the inconvenience.
          </p>
        </div>
      ) : (
        <>
          <FilterData
            className={classes.search}
            delay={200} // debounce typing
            filterService={service}
          />
          <div className={classes.scrollWrap}>
            <Virtuoso
              totalCount={stationListData.length}
              overscan={20}
              item={listRow}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </>
      )}
    </Paper>
  )
}

GenreStations.layout = AppDefaultLayout
