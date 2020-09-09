import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
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

// todo - implement react window

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
    root: {
      // opacity: 0
      // width: '100%',
      // // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper
    },
    secondary: {
      // opacity: 0,
      // marginTop: theme.spacing(1)
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
  if (router.isFallback) {
    return <CircularProgress />
  }
  if (!stations.length) {
    return <h2>NO DATA for </h2>
  }

  // console.log(`station ${stations[0]}`)

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

  // app/browse/by-location/EU/country/AL
  const breadcrumbLinks = [
    {
      href: '/app/browse',
      // as: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-location',
      // as: '/app/browse/by-location',
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

  return (
    <Paper>
      <LocationBreadCrumbs links={breadcrumbLinks} />
      {/* <div> */}
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
      {/* </div> */}
    </Paper>
  )
}

CountryStations.layout = AppDefaultLayout
