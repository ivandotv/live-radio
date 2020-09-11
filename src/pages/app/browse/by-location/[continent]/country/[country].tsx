import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { continents, countries } from 'countries-list'
import * as JsSearch from 'js-search'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { useEffect, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { FilterData } from '../../../../../../components/app/filterData'
import { AppDefaultLayout } from '../../../../../../components/app/layout/AppDefaultLayout'
import { LocationBreadCrumbs } from '../../../../../../components/app/locationBreadCrumbs'
import { TagList } from '../../../../../../components/app/tagList'
import { PageTitle } from '../../../../../../components/pageTitle'

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

export const getStaticProps: GetStaticProps = async function (ctx) {
  console.log('country get static props', ctx)

  const countryCode = ctx.params?.country as string
  const continent = ctx.params?.continent as string
  const country = countries[countryCode as keyof typeof countries]

  const api = new RadioBrowserApi('radio-next', fetch)
  const stations = await api.searchStations({
    countryCode: countryCode.toUpperCase()
  })

  const leanStations = []
  // strip properties that are not in use
  for (const station of stations) {
    // console.log('--- ', station.name)

    leanStations.push({
      tags: [...new Set(station.tags.split(','))],
      name: station.name,
      url: station.url_resolved,
      uuid: station.stationuuid,
      favicon: station.favicon,
      homepage: station.homepage,
      country: station.country,
      language: station.language.split(','),
      continent: country.continent
    })
  }

  return {
    props: {
      stations: leanStations,
      countryName: country.name,
      countryCode,
      continentName: continents[country.continent as keyof typeof continents],
      continentCode: continent
    },
    revalidate: 600 // 10 minutes
  }
}

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    // todo - add major countries
    paths: [{ params: { country: 'RS', continent: 'EU' } }],
    fallback: true
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

export default function CountryStations({
  stations,
  countryName,
  _countryCode,
  continentName,
  continentCode
}: {
  stations: RadioStation[]
  countryName: string
  _countryCode: string
  continentName: string
  continentCode: string
}) {
  const classes = useStyles()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const searchApi = useRef<JsSearch.Search>()
  const handleSearchData = (v: string) => {
    setSearchValue(v)
  }

  useEffect(() => {
    if (!router.isFallback) {
      if (!searchApi.current) {
        searchApi.current = new JsSearch.Search('uuid')
        searchApi.current.addIndex('tags')
        searchApi.current.addIndex('name')
      }
      searchApi.current.addDocuments(stations)
    }
  }, [stations, router.isFallback])

  if (router.isFallback) {
    // const skeletonList = []
    const skeletonList = new Array(5)
      .fill(1)
      .map((_, i) => (
        <Skeleton
          component="div"
          className={classes.listSkeleton}
          variant="rect"
          key={i}
          animation="wave"
        />
      ))

    return (
      <Paper className={classes.paper}>
        {/* <CircularProgress /> */}
        <Skeleton
          component="div"
          className={classes.breadcrumbsSkeleton}
          variant="rect"
        />

        {skeletonList}
      </Paper>
    )
  }

  const stationListData: RadioStation[] =
    searchValue.trim().length > 0
      ? (searchApi.current?.search(searchValue) as RadioStation[])
      : stations!

  const listRow = function (index: number) {
    const station = stationListData[index]

    return (
      <ListItem divider button key={station.uuid}>
        <ListItemText
          primary={station.name}
          secondary={<TagList tags={station.tags} />}
        />
      </ListItem>
    )
  }

  const breadcrumbLinks = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-location',
      text: 'By Location'
    },
    {
      href: '/app/browse/by-location/[continent]',
      as: `/app/browse/by-location/${continentCode}`,
      text: `${continentName}`
    },
    {
      text: `${countryName} ( ${stationListData.length} results )`
    }
  ]

  return (
    <Paper className={classes.paper}>
      <PageTitle title={`Browse For Stations in ${countryName}`} />
      <LocationBreadCrumbs links={breadcrumbLinks} />
      {!stations.length ? (
        <div className={classes.noData}>
          <p>
            Currently there is no data for {countryName}, sorry for the
            inconvenience.
          </p>
        </div>
      ) : (
        <>
          <FilterData
            className={classes.search}
            cb={handleSearchData}
            delay={200}
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

CountryStations.layout = AppDefaultLayout
