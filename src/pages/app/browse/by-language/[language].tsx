import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import {
  ListStations,
  RadioStation
} from '../../../../components/app/ListStations'

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [
      { params: { language: 'english' } },
      { params: { language: 'spanish' } },
      { params: { language: 'french' } },
      { params: { language: 'german' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const language = (ctx.params?.language as string).replace(/-/g, ' ')

  const api = new RadioBrowserApi('radio-next', fetch)
  const stations = await api.searchStations({
    language,
    limit: 1500,
    hideBroken: true
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
      language
    },
    revalidate: 600 // 10 minutes
  }
}

export default function LanguageStations({
  stations,
  language
}: {
  stations: RadioStation[]
  language: string
}) {
  const breadcrumbLinks = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-language',
      text: 'By Language'
    },
    {
      text: `${language}`
    }
  ]

  return (
    <ListStations
      title={`Browse For Stations in ${language}`}
      breadcrumbs={breadcrumbLinks}
      noData={`Currently there is no data for ${language}. Sorry for the inconvenience.`}
      rowPrimary={(station: RadioStation) =>
        `${station.name} | ${station.country}`
      }
      stations={stations}
    ></ListStations>
  )
}

LanguageStations.layout = AppDefaultLayout
