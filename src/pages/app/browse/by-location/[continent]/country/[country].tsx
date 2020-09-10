import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, fade } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { AppDefaultLayout } from '../../../../../../components/app/layout/AppDefaultLayout'
import { TagList } from '../../../../../../components/app/tagList'
import { countries, continents } from 'countries-list'
import { LocationBreadCrumbs } from '../../../../../../components/app/locationBreadCrumbs'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as JsSearch from 'js-search'
import { FilterData } from '../../../../../../components/app/filterData'

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

  // todo throw error test
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
      // height: 'calc( 100vh - 147px )', // todo calculate the value dinamically
      position: 'relative',
      height: '100%'
    },
    secondary: {
      // opacity: 0,
      // marginTop: theme.spacing(1)
    },
    search: {
      margin: theme.spacing(2)
      // width: '100%'
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
  countryCode: string
  continentName: string
  continentCode: string
}) {
  // list continents
  const classes = useStyles()
  const router = useRouter()
  console.log('stations router ', router)

  // index stations

  const searchApi = useRef<JsSearch.Search>()
  const filteredData = []
  useEffect(() => {
    // console.log(`station ${stations[0]}`)
    console.log('station effect is fallback:', router.isFallback)
    console.log('window exists ', window)
    console.log(`stations: ${stations}`)
    if (!router.isFallback) {
      if (!searchApi.current) {
        searchApi.current = new JsSearch.Search('uuid')
        searchApi.current.addIndex('tags')
        searchApi.current.addIndex('name')
      }
      searchApi.current.addDocuments(stations)
      if (window) {
        window.searchTest = searchApi.current
      }
    }
  }, [stations, router.isFallback])

  if (router.isFallback) {
    return <CircularProgress />
  }
  if (!stations.length) {
    return <h2>NO DATA for </h2>
  }

  const stationsList = []
  for (const station of stations) {
    stationsList.push(
      <ListItem divider button key={station.uuid}>
        <ListItemText
          classes={{
            root: classes.root,
            secondary: classes.secondary
          }}
          primary={station.name}
          secondary={<TagList tags={station.tags} />}
        />
      </ListItem>
    )
  }

  const row = function ({ data, style, index }) {
    // console.log('data ===== ', data)
    const station = data[index]

    return (
      <ListItem divider button style={style} key={station.uuid}>
        <ListItemText
          classes={
            {
              // root: classes.root,
              // secondary: classes.secondary
            }
          }
          primary={station.name}
          secondary={<TagList tags={station.tags} />}
        />
      </ListItem>
    )
  }

  // app/browse/by-location/EU/country/AL
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
      text: `${countryName}`
    }
  ]

  const handleSearchData = (v: string) => {
    console.log('search data parent ', v)
    // console.log('search: ', searchApi.current!.search(v))
  }

  return (
    <Paper className={classes.paper}>
      <LocationBreadCrumbs links={breadcrumbLinks} />
      <FilterData cb={handleSearchData} />
      <div className={classes.scrollWrap}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemSize={100}
              itemData={stations}
              itemCount={stations.length}
              width={width}
            >
              {row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </Paper>
  )
}

CountryStations.layout = AppDefaultLayout
